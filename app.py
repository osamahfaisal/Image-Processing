from flask import Flask , render_template,request
from flask_cors import CORS
import os
import base64  # convert from string to  bits
import json
import cv2
import numpy as np
from combine2 import functions as fn 
import time 
import calendar



app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

CORS(app)




@app.route("/",methods=["GET","POST"])
def main():
    return render_template("index.html")


@app.route('/saveImg',methods =['POST',"GET"])
def save_Img():
    if request.method == "POST":
 



        edgesImage1=((int(float(request.form["image1Y1"])) , int(float(request.form["image1Y2"]))) , (int(float(request.form["image1X1"])) , int(float(request.form["image1X2"]))))
        edgesImage2=((int(float(request.form["image2Y1"])) , int(float(request.form["image2Y2"]))) , (int(float(request.form["image2X1"])) , int(float(request.form["image2X2"]))))


        option = request.form["option"]
        original_image_1 = base64.b64decode(request.form["image1"].split(',')[1])
        original_image_2 = base64.b64decode(request.form["image2"].split(',')[1])
    
        fn.saveOrgin(original_image_1 , original_image_2)  
        result =fn.margeImages(option,edgesImage1,edgesImage2,request.form["phaseCheckboxValue"],request.form["magnitudeCheckboxValue"])

        current_GMT = time.gmtime()

        time_stamp = calendar.timegm(current_GMT)


       
        if result[1][1] > 500:
            width=500
        else:
            width=result[1][1]
        if result[1][0]>300:
            hight=300
        else:
            hight=result[1][0]


        #  send the result to  js 
    return json.dumps({1: f'<img src="{result[0]}?t={time_stamp}" width="{width}" hight="{hight}" id="comb_img" alt="" >'})

if __name__ == "__main__":
    app.run(debug=True , port=2226)