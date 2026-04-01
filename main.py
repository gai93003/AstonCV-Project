from datetime import datetime, timedelta
import time

from whatsapp_sender import send_whatsapp_message

mobile = input('Enter Mobile No of Receiver : ')
message = input('Enter message you want to send: ')
delay_minutes = int(input('Send after how many minutes? : '))

if delay_minutes < 1:
    raise ValueError('Delay must be at least 1 minute.')

now = datetime.now()
send_time = now + timedelta(minutes=delay_minutes)
wait_seconds = int((send_time - now).total_seconds())

print(f"Scheduled for {send_time.strftime('%H:%M')} ({wait_seconds} seconds from now)")
time.sleep(wait_seconds)
message_sid = send_whatsapp_message(mobile, message)
print(f"Message sent successfully. SID: {message_sid}")