import axios from 'axios';
import Env from '@ioc:Adonis/Core/Env'

export default class copomex{
    public static async getAddress(zipcode){        
        try {
            const { data } = await axios.get(`https://api.copomex.com/query/info_cp/${zipcode}?token=${Env.get('TOKEN_COPOMEX')}`);
           // const { data } = await axios.get(`https://api.copomex.com/query/info_cp/${zipcode}?token=pruebas`);    
            return data[0].response
        } catch (error) {
            return null
        }
    }
}