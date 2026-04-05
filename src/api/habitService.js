import axios from 'axios';

const API_URL = "http://localhost:8080/api/habits";

export const getHabits = (userId) => axios.get(`${API_URL}/user/${userId}`);

export const toggleTick = (habitId, date) => {
    // date should be in YYYY-MM-DD format
    return axios.post(`${API_URL}/tick?habitId=${habitId}&date=${date}`);
};

export const createHabit = (habitData) => axios.post(`${API_URL}/create`, habitData);