from dotenv import load_dotenv
import yagmail
import os

load_dotenv()

email = os.getenv('email')
password = os.getenv('password')

yag = yagmail.SMTP(user=email, password=password)
attachments = './5a-data.json'
contents = [
    "This is the body, and here is just text http://somedomain/image.png",
]
yag.send('timothydoe92@gmail.com', 'For the company!', contents, attachments=attachments)

# Alternatively, with a simple one-liner:
# yagmail.SMTP('mygmailusername').send('to@someone.com', 'subject', contents)