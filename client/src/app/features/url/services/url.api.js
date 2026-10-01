import axios from 'axios';

const urlApiInstance = axios.create({
    baseURL: '/api/url',
    withCredentials: true,
});

export async function createShortenUrl(url) {
    try {
        const response = await urlApiInstance.post('/', {
            url,
        });

        return response.data || response.data?.url;
    } catch (err) {
        console.log('Error occured while creating shorten url', err);
        throw err.response?.data || err;
    }
}

export async function getShortenUrlById(id) {
    try {
        const response = await urlApiInstance.get(`/:${id}`);

        return response.data || response.data?.url;
    } catch (err) {
        console.log('Error occured while fetching url', err);
        throw err.response?.data || err;
    }
}

export async function getAllUrls() {
    try {
        const response = await urlApiInstance.get('/');

        return response.data || response.data?.url;
    } catch (err) {
        console.log('Error occured while fetching all the urls', err);
        throw err.response?.data || err;
    }
}

export async function deleteUrl(id) {
    try {
        const response = await urlApiInstance.delete(`/:${id}`);

        return response.data || response.data?.url;
    } catch (err) {
        console.log('Error deleting url', err);
        throw err.response?.data || err;
    }
}

export async function redirectUrl(shortcode) {
    try {
        const response = await urlApiInstance.get(`/redirect/:${shortcode}`);

        return response.data || response.data?.url;
    } catch (err) {
        console.log('Error in redirecting', err);
        throw err.response?.data || err;
    }
}
