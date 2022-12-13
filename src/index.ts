import express from 'express'
import client, { Connection, Channel, ConsumeMessage } from 'amqplib'

const app = express()

const sendMessages = (channel: Channel, msg: string) => {
  channel.sendToQueue('myQueue', Buffer.from(msg))
}

const consumer =
  (channel: Channel) =>
  (msg: ConsumeMessage | null): void => {
    if (msg) {
      console.log(msg.content.toString())
      channel.ack(msg)
    }
  }

const go = async () => {
  const connection: Connection = await client.connect(
    'amqp://username:password@localhost:5672'
  )
  const channel: Channel = await connection.createChannel()
  await channel.assertQueue('myQueue')

  // sendMessages(channel)

  // await channel.consume('myQueue', consumer(channel))

  app.get('/', (req, res) => {
    sendMessages(channel, 'Hello World')
    res.send('Worked')
  })

  app.listen(3000, () => console.log('Server is running...'))
}

go()
