import axios from 'axios'
const BASE_URL = "https://api.nomics.com/v1/exchange-rates/history?key=demo-26240835858194712a4f8cc0dc635c7a&currency=BTC"

export function getData(start, end) {
    console.warn(start,end)
    return axios 
    .get(BASE_URL + `&start=${start}T00:00:00.999Z&end=${end}T00:00:00.586Z`)
}