import axios from 'axios'

const urlApiInstance = axios.create({
    baseURL: '/api/url',
    withCredentials: true
})


export async function createShortenUrl(url) {
    try{
        const response = await urlApiInstance.post('/',{
            url
        })

        return response.data || response.data?.url
    } catch(err){
        console.log('Error occured while creating shorten url', err)
        throw err.response?.data || err
    }
}

export async function getShortenUrlById(id){
    try{
        const response = await urlApiInstance.get('/',{
            id
        })

        return response.data || response.data?.url
    } catch(err){
        console.log('Error occured while fetching url', err)
        throw err.response?.data || err
    }
}