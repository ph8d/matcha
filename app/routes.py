from flask import render_template, session, request

from wtforms import Form, StringField, TextAreaField, PasswordField, validators

from app import app

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST' and request.form:
        print(request.form)
    return render_template('register.html', title='Register')

class RegisterForm (Form):
    name = StringField("Name")

@app.route('/login')
def login():
    # something here
    return render_template('login.html', title='Login')

@app.route('/about')
def about():
    return render_template('about.html', title='About')