from rest_framework import serializers
from accounts.models.user_profiles import UserProfile 
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from django.utils.encoding import force_bytes, force_str 

#send registration confirm email
def send_confirm_mail(register_user):
    uid = urlsafe_base64_encode(force_bytes(register_user.id))

    #The token then consists of the current timestamp and the hash of these four values.
    #The first three values are already in the database, 
    #and the fourth value is part of the token, so Django can verify the token at any time
    confirm_token = default_token_generator.make_token(register_user)
    link = settings.REGISTER_CONFIRM_LINK + uid + "/"+ confirm_token + "/"
    message = MIMEMultipart()
    message['From'] = settings.SENDER_ADDRESS
    message['To'] = register_user.email
    message['Subject'] = "PCAW: Registration Confirmation"
    
    message.attach(MIMEText(settings.CONFIRM_MAIL(link), 'html'))

    session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
    session.starttls() #enable security
    session.login(settings.SENDER_ADDRESS, settings.SENDER_PASS) #login with mail_id and password
    text = message.as_string()
    session.sendmail(settings.SENDER_ADDRESS, register_user.email, text)
    session.quit()
    return


#send enroll notification
def send_enroll_notification(student, enroll_class):
    message = MIMEMultipart()
    message['From'] = settings.SENDER_ADDRESS
    message['To'] = student.email
    message['Subject'] = "PCAW: You Have Just Enrolled To Class " + enroll_class.name
    message.attach(MIMEText(settings.ENROLL_NOTIF_MAIL(student, enroll_class), 'html'))

    session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
    session.starttls() #enable security
    session.login(settings.SENDER_ADDRESS, settings.SENDER_PASS) #login with mail_id and password
    text = message.as_string()
    session.sendmail(settings.SENDER_ADDRESS, student.email, text)
    session.quit()
    return
