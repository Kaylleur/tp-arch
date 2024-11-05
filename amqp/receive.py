#!/usr/bin/env python
import pika
import time
import sys

credentials = pika.PlainCredentials('user', 'password')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost', credentials=credentials))
channel = connection.channel()

exchange = 'events-discord'
queue = 'sysA'

channel.exchange_declare(exchange=exchange, exchange_type='direct', durable=True)


result = channel.queue_declare(queue, exclusive=False)
queue_name = result.method.queue

channel.queue_bind(exchange=exchange, queue=queue_name)
print(' [*] %r binding on %r' % (exchange, queue_name))

print(' [*] Waiting for logs. To exit press CTRL+C')


def callback(ch, method, properties, body):
    # count += 1
    print(" [x] %r:%r" % (method.routing_key, body))
    time.sleep(1)
    channel.basic_ack(delivery_tag=method.delivery_tag)
    print(" [x] Ack message %r" % body)
    # print(" [x] Total %r" % count)


channel.basic_consume(
    queue=queue_name, on_message_callback=callback, auto_ack=False)

channel.start_consuming()
