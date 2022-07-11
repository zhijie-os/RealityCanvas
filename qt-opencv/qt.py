import os
import sys
import time

import cv2
from PySide6.QtCore import Qt, QThread, Signal, Slot
from PySide6.QtGui import QAction, QImage, QKeySequence, QPixmap
from PySide6.QtWidgets import (QApplication, QComboBox, QGroupBox,
                               QHBoxLayout, QLabel, QMainWindow, QPushButton,
                               QSizePolicy, QVBoxLayout, QWidget)

import numpy as np
"""This example uses the video from a  webcam to apply pattern
detection from the OpenCV module. e.g.: face, eyes, body, etc."""


point = (0,0)
rgbFilter = [0,0,0]

def getBound():
    h = rgbFilter[2]
    s = rgbFilter[1]
    v = rgbFilter[0]
    
    lower_bound = np.array(
        [ h-20 if h-20>=0 else h, s-20 if s-20>=0 else s , v-20 if v-20>=0 else v], np.uint8)

    upper_bound = np.array(
        [ h+20 if h+20<=255 else h, s+20 if s+20<=255 else s , v+20 if v+20<=255 else v], np.uint8)
    return lower_bound, upper_bound

class MyLabel(QLabel):
    def __init__(self,parent=None):
        QLabel.__init__(self,parent)
    
    def mousePressEvent(self, event):
        print(event.position().x(), event.position().y())
        global point 
        point = (int(event.position().x()), int(event.position().y()))

class Thread(QThread):
    updateFrame = Signal(QImage)

    def __init__(self, parent=None):
        QThread.__init__(self, parent)
        self.trained_file = None
        self.status = True
        self.cap = True

    def set_file(self, fname):
        # The data comes with the 'opencv-python' module
        self.trained_file = os.path.join(cv2.data.haarcascades, fname)

    # def getPos(self , event):
    #     print(event.pos().x(),y = event.pos().y() )
        

    def run(self):
        global rgbFilter, point 
        self.cap = cv2.VideoCapture(0)
        while self.status:
            cascade = cv2.CascadeClassifier(self.trained_file)
            ret, frame = self.cap.read()
            if not ret:
                continue

            # Reading frame in gray scale to process the pattern
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            detections = cascade.detectMultiScale(gray_frame, scaleFactor=1.1,
                                                  minNeighbors=5, minSize=(30, 30))


            # Drawing green rectangle around the pattern
            for (x, y, w, h) in detections:
                pos_ori = (x, y)
                pos_end = (x + w, y + h)
                color = (0, 255, 0)
                cv2.rectangle(frame, pos_ori, pos_end, color, 2)

            # # Reading the image in RGB to display it
            # color_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            if(rgbFilter!=[0,0,0]):
                lower_bound, upper_bound = getBound()
                mask = cv2.inRange(frame, lower_bound, upper_bound)

                # Morphological Transform, Dilation
                kernal = np.ones((5, 5), "uint8")

                # For green color
                mask = cv2.dilate(mask, kernal)
                resFrame = cv2.bitwise_and(frame, frame,
                                            mask=mask)
                color_frame = cv2.cvtColor(resFrame, cv2.COLOR_BGR2RGB)
            else:
                color_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)


            # Creating and scaling QImage
            h, w, ch = color_frame.shape
            img = QImage(color_frame.data, w, h, ch * w, QImage.Format_RGB888)
            scaled_img = img.scaled(640, 480, Qt.KeepAspectRatio)
            
            if(point!=(0,0)):
                rgbFilter=[scaled_img.pixelColor(point[0],point[1]).getRgb()[0],scaled_img.pixelColor(point[0],point[1]).getRgb()[1],scaled_img.pixelColor(point[0],point[1]).getRgb()[2]]
            # print(scaled_img.pixelColor(3,3).getRgb())
            # Emit signal
            self.updateFrame.emit(scaled_img)
        sys.exit(-1)


class Window(QMainWindow):
    def __init__(self):
        super().__init__()
        # Title and dimensions
        self.setWindowTitle("Patterns detection")
        self.setGeometry(0, 0, 800, 500)

        # Main menu bar
        self.menu = self.menuBar()
        self.menu_file = self.menu.addMenu("File")
        exit = QAction("Exit", self, triggered=qApp.quit)
        self.menu_file.addAction(exit)

        self.menu_about = self.menu.addMenu("&About")
        about = QAction("About Qt", self, shortcut=QKeySequence(QKeySequence.HelpContents),
                        triggered=qApp.aboutQt)
        self.menu_about.addAction(about)

        # Create a label for the display camera
        self.label = MyLabel(self)
        self.label.setFixedSize(640, 480)

        # Thread in charge of updating the image
        self.th = Thread(self)
        self.th.finished.connect(self.close)
        self.th.updateFrame.connect(self.setImage)

        # Model group
        self.group_model = QGroupBox("Trained model")
        self.group_model.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Expanding)
        model_layout = QHBoxLayout()

        self.combobox = QComboBox()
        for xml_file in os.listdir(cv2.data.haarcascades):
            if xml_file.endswith(".xml"):
                self.combobox.addItem(xml_file)

        model_layout.addWidget(QLabel("File:"), 10)
        model_layout.addWidget(self.combobox, 90)
        self.group_model.setLayout(model_layout)

        # Buttons layout
        buttons_layout = QHBoxLayout()
        self.button1 = QPushButton("Start")
        self.button2 = QPushButton("Stop/Close")
        self.button1.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Expanding)
        self.button2.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Expanding)
        buttons_layout.addWidget(self.button2)
        buttons_layout.addWidget(self.button1)

        right_layout = QHBoxLayout()
        right_layout.addWidget(self.group_model, 1)
        right_layout.addLayout(buttons_layout, 1)

        # Main layout
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addLayout(right_layout)

        # Central widget
        widget = QWidget(self)
        widget.setLayout(layout)
        self.setCentralWidget(widget)

        # Connections
        self.button1.clicked.connect(self.start)
        self.button2.clicked.connect(self.kill_thread)
        self.button2.setEnabled(False)
        self.combobox.currentTextChanged.connect(self.set_model)

    @Slot()
    def set_model(self, text):
        self.th.set_file(text)

    @Slot()
    def kill_thread(self):
        print("Finishing...")
        self.button2.setEnabled(False)
        self.button1.setEnabled(True)
        self.th.cap.release()
        cv2.destroyAllWindows()
        self.status = False
        self.th.terminate()
        # Give time for the thread to finish
        time.sleep(1)

    @Slot()
    def start(self):
        print("Starting...")
        self.button2.setEnabled(True)
        self.button1.setEnabled(False)
        self.th.set_file(self.combobox.currentText())
        self.th.start()

    @Slot(QImage)
    def setImage(self, image):
        self.label.setPixmap(QPixmap.fromImage(image))


    


if __name__ == "__main__":
    app = QApplication()
    w = Window()
    w.show()
    sys.exit(app.exec())