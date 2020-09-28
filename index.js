addEventListener('fetch', ev => ev.respondWith(handleRequest()))
addEventListener('scheduled', ev => ev.waitUntil(main()))

const sendMessage = async message => {
  return fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
    }),
  })
}

const getTemperature = async () => {
  const resp = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=imperial&appid=${APPID}`,
  )

  const {
    main: { temp: temperature },
  } = await resp.json()

  return {
    temperature,
    temperatureMessage: `The current temperature in ${CITY} is ${Math.floor(
      temperature,
    )} degrees`,
  }
}

async function main() {
  const { temperatureMessage } = await getTemperature()
  await sendMessage(temperatureMessage)
  return temperatureMessage
}

async function handleRequest() {
  return new Response(await main(), {
    headers: { 'content-type': 'text/plain' },
  })
}
