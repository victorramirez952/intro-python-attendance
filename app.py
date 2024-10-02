from flask import Flask
from flask import render_template, url_for, request, redirect, jsonify, make_response
from dotenv import load_dotenv
import json
import os
import logging
import datetime
import yagmail

load_dotenv()

email = os.getenv('email')
password = os.getenv('password')
promptPwd = os.getenv('promptPwd')

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

logging.basicConfig(level=logging.INFO)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/upload', methods=['POST'])
def upload_file():
    logging.info('Uploading file')
    if 'file' not in request.files:
        logging.info('File not in request')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        logging.info('FIle is empty')
        return redirect(request.url)
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        with open(file_path) as f:
            data = json.load(f)
        return render_template('index.html', data=data)
    return redirect(request.url)

@app.route('/generate-default-data', methods=['POST', 'GET'])
def generate_default_data():
    json_file_path = os.path.join(app.static_folder, 'data', '3e-3f-data.json')
    with open(json_file_path, 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
    return render_template('index.html', data=data)

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    logging.info('Data json: %s', data)
    
    json_file_path = './uploads/data.json'
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    recipient = 'victory.ramirez@ppsc.edu.mx'
    subject = 'JSON attendance ' + str(datetime.datetime.now())
    contents = [
        "Registro de asistencia",
    ]
    attachments = json_file_path

    yag = yagmail.SMTP(user=email, password=password)
    yag.send(to=recipient, subject=subject, contents=contents, attachments=attachments)
    return redirect(url_for('index'))

@app.route('/set-password-cookie', methods=['GET'])
def set_password_cookie():
    response = make_response(jsonify({'message': 'Cookie set', 'password': promptPwd}))
    return response