const TelegramApi = require("node-telegram-bot-api")
const token = "7799144990:AAGDvnNFvajEY1ckkP4MIZopTOHxKSMH3qI"
const bot = new TelegramApi(token, {polling: true})
const {gameOptions, tryAgainOptions} = require('./options')

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "сейчас я загадаю цифру от 1 до 9, а ты попробуй угадать. Угадаешь - получаешь 50р.💵 на свой счет!")
    const value = Math.floor((Math.random() * 10))
    chats[chatId] = value
    await bot.sendMessage(chatId, "Отгадывай!", gameOptions)
}



const start = () => {
    bot.setMyCommands([
        {command: '/start', description: "начальное приветствие"},
        {command: '/info', description: "получить информацию пользователя"},
        {command: '/game', description: 'игра "угадай число"'}
    ])

    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            return bot.sendMessage(chatId, "Добро пожаловать в личный телеграм бот Сармата!")
        }

        if (text === "/info") {
            const firstName = msg.from.first_name
            const lastName = msg.from.last_name
            if (firstName && lastName){
                return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
            }
            else {
                return bot.sendMessage(chatId, `Тебя зовут ${firstName}`)
            }
        }
        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "Я не знаю такой команды!")
    })

    bot.on("callback_query", async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === "/again") {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, "Ты угадал! на твой счет зачислено 50р! Чтобы вывести их, отправь данные своей банковской карточки, в том числе CVV код!", tryAgainOptions)
        }
        else {
            return bot.sendMessage(chatId, `Не повезло.. попробуй позже. Загаданная цифра: ${chats[chatId]}`, tryAgainOptions)
        }

        
    })
}

start()