import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { config } from "../config.jsx";
import useDocumentTitle from '../useDocumentTitle';
import '../css/basic.css';
import '../css/lk.css';
import Modal from './Modal.jsx';
import profile from '../images/icons/profile.svg';


export function Lk () {
  useDocumentTitle('Личный кабинет');
  const location = useLocation();
  const [data, setData] = useState();
  const navigate = useNavigate()
  const [comparisonList, setComparisonList] = useState([]);
  const [modalActiveFavorites, setModalActiveFavorites] = useState(false)
  const [modalActiveCompare, setModalActiveCompare] = useState(false)
  const [modalActiveCompareAuth, setModalActiveCompareAuth] = useState(false)
  const [modalActiveCompareCategory, setModalActiveCompareCategory] = useState(false)
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [devicesToCompareIds, setDevicesToCompareIds] = useState(() => {
    const value = JSON.parse(localStorage.getItem('devicesToCompare')) ?? [];
    return value;
  })

  useEffect(() => {
    const hash = location.hash.substring(1); 
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    if (devicesToCompareIds !== null && devicesToCompareIds.length > 0) {
      console.log("Обновление хранилища", devicesToCompareIds)
      localStorage.setItem('devicesToCompare', JSON.stringify(devicesToCompareIds));
    }
    

    const loadDevicesToCompare = async () => {
      try {
        const idsString = devicesToCompareIds !== null && devicesToCompareIds.length > 0 ? devicesToCompareIds.join(',') : "0";
        const response = await axios.get(`${config.API_BASE_URL}/api/Profile/getComparisonDevices/${idsString}`, {withCredentials: true});
        console.log("Compare", response.data);
        setComparisonList(response.data)
      } catch (error) {
        console.log(error);
        setComparisonList([])
      }
    }

    loadDevicesToCompare()
  }, [devicesToCompareIds])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/Profile/getUserInfo`, { withCredentials: true });
        setData(response.data)
        setAuthenticated(true)
        console.log(response.data)
      } catch (error) {
        console.log(error)
        setAuthenticated(false)
      }

      try {
        const idsString = devicesToCompareIds !== null && devicesToCompareIds.length > 0 ? devicesToCompareIds.join(',') : "0";
        const response = await axios.get(`${config.API_BASE_URL}/api/Profile/getComparisonDevices/${idsString}`, {withCredentials: true});
        console.log("Compare", response.data);
        setComparisonList(response.data)
      } catch (error) {
        console.log(error);
        setComparisonList([])
      }
    }

    fetchData()
  }, [])

  const logoutButtonHandler = async () => {
    try {
        const response = await axios.get(`${config.API_BASE_URL}/api/Auth/logout`, { withCredentials: true });
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
    navigate('/')
  }

  const handleFavoriteButtonForCompare = async (isFavorite, deviceId) => {
    try {
      if (isFavorite) {
        await axios.delete(`${config.API_BASE_URL}/api/FavoriteDevice/${deviceId}`, { withCredentials: true });
      } else {
        await axios.post(`${config.API_BASE_URL}/api/FavoriteDevice/${deviceId}`, null, { withCredentials: true });
      }

      const updComparisonData = comparisonList.map(
        device => device.id === deviceId ? { ...device, isFavorite: !isFavorite } : device
      )

      setComparisonList(updComparisonData)
    } catch (error) {
      console.log(error);
      setModalActiveFavorites(true)
      // if (error.response.status === 401) {
      //   setModalActiveFavoritesAuth(true)
      // }
      // else {
      //   setModalActiveFavorites(true)
      // }
    }

    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/Profile/getUserInfo`, { withCredentials: true });
      setData(response.data)
    } catch (error) {
      console.log(error)
    }
  };

  const handleFavoriteButton = async (deviceId) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/api/FavoriteDevice/${deviceId}`, { withCredentials: true });

      const updatedData = {
        ...data,
        favoriteDevices: data.favoriteDevices.filter(device => device.id !== deviceId)
      };

      setData(updatedData);
      console.log("Updated Data:", updatedData);
    } catch (error) {
      console.log(error);
      setModalActiveFavorites(true)
    }
  };

  const handleComparisonButton = (device) => {
    if (!isAuthenticated) {
      setModalActiveCompareAuth(true)
      return;
    }

    if (comparisonList.length > 0 && data && data.favoriteDevices) {
      const firstDeviceCategory = data.favoriteDevices.find(d => d.id === comparisonList[0].id).categoryId;

      if (device.categoryId !== firstDeviceCategory) {
        setModalActiveCompareCategory(true);
        return;
      }
    }

    if (devicesToCompareIds === null || devicesToCompareIds !== null && !devicesToCompareIds.includes(device.id)) {
      if (devicesToCompareIds === null || devicesToCompareIds !== null && devicesToCompareIds.length < 4) {
        setDevicesToCompareIds([...devicesToCompareIds, device.id])
      }
      else {
        setModalActiveCompare(true)
      }
    }
    else if (devicesToCompareIds !== null) {
      setDevicesToCompareIds(devicesToCompareIds.filter(item => item !== device.id))
    }
  };

  // useEffect(() => {
  //   console.log("Обновление хранилища", devicesToCompareIds)
  //   localStorage.setItem('devicesToCompare', JSON.stringify(devicesToCompareIds));
  // }, [devicesToCompareIds]);
  
  return (
    <>
    <main className='lk'>
      <div className="nav-login">
        <div className="navigation">
          <nav className='nav-lk'>
            <Link className="lk" to="/" target="_blank">
              <svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none">
                <defs/>
                <rect id="background-lk" rx="16.000000" width="32.000000" height="32.000000" fill="#EBF7FF" fill-opacity="1.000000"/>
                <path id="icon-lk" d="M16 27.37C17.99 27.37 19.95 26.85 21.68 25.85L21.68 22.12C21.68 21.08 21.27 20.07 20.53 19.34C19.79 18.6 18.79 18.18 17.75 18.18L14.25 18.18C13.2 18.18 12.2 18.6 11.46 19.34C10.72 20.07 10.31 21.08 10.31 22.12L10.31 25.85C12.04 26.85 14 27.37 16 27.37ZM24.31 22.12L24.31 23.76C25.82 22.14 26.83 20.11 27.2 17.93C27.58 15.74 27.31 13.5 26.43 11.46C25.55 9.43 24.09 7.7 22.23 6.48C20.38 5.27 18.21 4.62 16 4.62C13.78 4.62 11.61 5.27 9.76 6.48C7.9 7.7 6.44 9.43 5.56 11.46C4.68 13.5 4.41 15.74 4.79 17.93C5.16 20.11 6.17 22.14 7.68 23.76L7.68 22.12C7.68 20.77 8.1 19.45 8.88 18.34C9.66 17.23 10.76 16.4 12.03 15.94C11.37 15.18 10.94 14.24 10.8 13.25C10.65 12.25 10.8 11.23 11.22 10.32C11.64 9.4 12.31 8.62 13.15 8.08C14 7.53 14.99 7.24 16 7.24C17 7.24 17.99 7.53 18.84 8.08C19.68 8.62 20.35 9.4 20.77 10.32C21.19 11.23 21.34 12.25 21.19 13.25C21.05 14.24 20.62 15.18 19.96 15.94C21.23 16.4 22.33 17.23 23.11 18.34C23.89 19.45 24.31 20.77 24.31 22.12ZM16 30C19.71 30 23.27 28.52 25.89 25.89C28.52 23.27 30 19.71 30 16C30 12.28 28.52 8.72 25.89 6.1C23.27 3.47 19.71 2 16 2C12.28 2 8.72 3.47 6.1 6.1C3.47 8.72 2 12.28 2 16C2 19.71 3.47 23.27 6.1 25.89C8.72 28.52 12.28 30 16 30ZM18.62 12.5C18.62 13.19 18.34 13.86 17.85 14.35C17.36 14.84 16.69 15.12 16 15.12C15.3 15.12 14.63 14.84 14.14 14.35C13.65 13.86 13.37 13.19 13.37 12.5C13.37 11.8 13.65 11.13 14.14 10.64C14.63 10.15 15.3 9.87 16 9.87C16.69 9.87 17.36 10.15 17.85 10.64C18.34 11.13 18.62 11.8 18.62 12.5Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
              </svg>          
            </Link>
            <div className="lk section">
              <Link className="lk section item" to="/#block2" target="_blank">оборудование</Link>
            </div>
          </nav>
          <button className="category button-detail out button-lk">
            <div className="category button-detail info out button-lk logout">
              <button className="category button-detail text out button-lk" onClick={logoutButtonHandler}>выйти</button>
            </div>
          </button>
        </div>
        <div className="profile">
          <div className="login">{data != null && data.login}</div>
          <img src={profile} alt='Профиль'/>
        </div>
        <h1 className='h1-lk'>Избранное оборудование:</h1>
      </div>
      <div className="favourites-cards">
      {data && data.login && data.favoriteDevices && data.favoriteDevices.length > 0 ? (
        data.favoriteDevices.map((device) => (
          <div className="card">
            <div className="button-container button-lk">
              <button onClick={() => handleFavoriteButton(device.id)} className="icon-button" title="Добавить в избранное">
              {device.isFavorite ? (
                <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                  <defs />
                  <path fill="#48547C" d="M6.75 0C4.95 0 3.24 0.7 1.97 1.96C0.71 3.22 0 4.93 0 6.72L0 40.63C0 41.22 0.15 41.8 0.45 42.31C0.74 42.82 1.16 43.24 1.68 43.54C2.19 43.84 2.77 43.99 3.36 44C3.95 44 4.53 43.84 5.04 43.55L16.88 36.82C17.22 36.62 17.6 36.52 18 36.52C18.39 36.52 18.77 36.62 19.11 36.82L30.95 43.55C31.46 43.84 32.04 44 32.63 44C33.22 43.99 33.8 43.84 34.31 43.54C34.83 43.24 35.25 42.82 35.54 42.31C35.84 41.8 36 41.22 36 40.63L36 6.72C36 4.93 35.28 3.22 34.02 1.96C32.75 0.7 31.04 0 29.25 0L6.75 0ZM4.19 5.69Q4.39 5.2 4.79 4.8Q5.19 4.4 5.67 4.2Q6.16 4 6.75 4L29.25 4Q29.83 4 30.32 4.2Q30.8 4.4 31.2 4.8Q31.6 5.2 31.8 5.69Q32 6.17 32 6.72L32 39.55L21.09 33.34Q20.37 32.93 19.6 32.73Q18.83 32.52 18 32.52Q17.17 32.52 16.4 32.73Q15.62 32.93 14.9 33.34L4 39.55L4 6.72Q4 6.17 4.19 5.69Z" fill-opacity="1.000000" fill-rule="evenodd"/>
                </svg>
              ) : (
                <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                  <defs />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 0C4.95979 0 3.2429 0.708155 1.97703 1.96868C0.711159 3.2292 1.99959e-07 4.93884 1.99959e-07 6.72149V40.6381C-0.000203284 41.2268 0.154901 41.8053 0.449785 42.3155C0.74467 42.8258 1.16899 43.25 1.68026 43.5456C2.19153 43.8412 2.77182 43.9979 3.36303 44C3.95425 44.0021 4.53563 43.8495 5.049 43.5575L16.884 36.8225C17.2239 36.6292 17.6086 36.5275 18 36.5275C18.3914 36.5275 18.7761 36.6292 19.116 36.8225L30.951 43.5575C31.4644 43.8495 32.0458 44.0021 32.637 44C33.2282 43.9979 33.8085 43.8412 34.3197 43.5456C34.831 43.25 35.2553 42.8258 35.5502 42.3155C35.8451 41.8053 36.0002 41.2268 36 40.6381V6.72149C36 4.93884 35.2888 3.2292 34.023 1.96868C32.7571 0.708155 31.0402 0 29.25 0H6.75Z" fill="#48547C"/>
                </svg>
              )}
              </button>
              <button onClick={() => handleComparisonButton(device)} className="icon-button" title="Сравнить" >
              {devicesToCompareIds !== null && devicesToCompareIds.includes(device.id) ? (
                <svg width="42" height="41.5" viewBox="0 0 42 41.5" fill="none">
                  <path d="M2 2V39.6071C2 39.9766 2.14675 40.3308 2.40796 40.592C2.66917 40.8533 3.02345 41 3.39286 41H41" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.7955 18.7144H9.31334C8.35177 18.7144 7.57227 19.4939 7.57227 20.4554V33.6876C7.57227 34.6491 8.35177 35.4286 9.31334 35.4286H12.7955C13.757 35.4286 14.5366 34.6491 14.5366 33.6876V20.4554C14.5366 19.4939 13.757 18.7144 12.7955 18.7144Z" fill="#48547C" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M25.3306 14.5356H21.8485C20.8869 14.5356 20.1074 15.3151 20.1074 16.2767V33.6874C20.1074 34.649 20.8869 35.4285 21.8485 35.4285H25.3306C26.2922 35.4285 27.0717 34.649 27.0717 33.6874V16.2767C27.0717 15.3151 26.2922 14.5356 25.3306 14.5356Z" fill="#48547C" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M37.8326 8.96436H34.3504C33.3889 8.96436 32.6094 9.74386 32.6094 10.7054V33.6876C32.6094 34.6491 33.3889 35.4286 34.3504 35.4286H37.8326C38.7942 35.4286 39.5737 34.6491 39.5737 33.6876V10.7054C39.5737 9.74386 38.7942 8.96436 37.8326 8.96436Z" fill="#48547C" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>            
              ) : (
                <svg width="46" height="45.5" viewBox="0 0 46 45.5" fill="none">
                  <defs/>
                  <path id="Vector1" d="M2 2L2 43.46C2 43.87 2.16 44.26 2.45 44.55C2.73 44.83 3.12 45 3.53 45L45 45" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round" stroke-linecap="round"/>
                  <path id="Vector2" d="M13.9 20.42C14.96 20.42 15.82 21.28 15.82 22.34L15.82 36.93C15.82 37.99 14.96 38.85 13.9 38.85L10.06 38.85C9 38.85 8.14 37.99 8.14 36.93L8.14 22.34C8.14 21.28 9 20.42 10.06 20.42L13.9 20.42Z" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round"/>
                  <path id="Vector3" d="M27.72 15.82C28.78 15.82 29.64 16.68 29.64 17.74L29.64 36.93C29.64 37.99 28.78 38.85 27.72 38.85L23.88 38.85C22.82 38.85 21.96 37.99 21.96 36.93L21.96 17.74C21.96 16.68 22.82 15.82 23.88 15.82L27.72 15.82Z" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round"/>
                  <path d="M41.5 9.67C42.56 9.67 43.42 10.53 43.42 11.59L43.42 36.93C43.42 37.99 42.56 38.85 41.5 38.85L37.66 38.85C36.6 38.85 35.74 37.99 35.74 36.93L35.74 11.59C35.74 10.53 36.6 9.67 37.66 9.67L41.5 9.67Z" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round"/>
                </svg>
              )}
            </button>
            </div>
            <img className="photo-card" src={require(`../images/category/${device.imageName}.png`)} alt={device.name}/>
            <h2>{device.name}</h2>
            <Link to={`/category/${device.categoryId}`} className="button-detail more button-lk" target="_blank">
              <div className="button-detail info button-lk">
                <div className="button-detail text button-lk">подробнее</div>
                <svg className="button-detail arrow button-lk" width="42.133301" height="42.133301" viewBox="0 0 42.1333 42.1333" fill="none">
                  <defs/>
                  <rect className="background-arrow" rx="21.066668" width="42.133335" height="42.133335" transform="matrix(-1 0 0 1 42.1333 0)" fill="#EBF7FF" fill-opacity="1.000000"/>
                  <path d="M17.11 10.53L27.64 21.06L17.11 31.6" stroke="#48547C" stroke-opacity="1.000000" stroke-width="5.266667" stroke-linejoin="round" stroke-linecap="round"/>
                </svg>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center'}}>Ваш список избранного пуст.<br/>Добавьте оборудование, чтобы увидеть его здесь.</p>
      )}
      </div>
      <h1 className='h1-lk'>Оборудование для сравнения:</h1>
      <div className="favourites-cards compare">
      {comparisonList !== null && comparisonList.length > 0 ? (
        comparisonList.map((device) => (
        <div className="card compare">
          <div className="button-container button-lk">
            <button onClick={() => handleFavoriteButtonForCompare(device.isFavorite, device.id)} className="icon-button" title="Добавить в избранное">
              {device.isFavorite ? (
                <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                  <defs />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 0C4.95979 0 3.2429 0.708155 1.97703 1.96868C0.711159 3.2292 1.99959e-07 4.93884 1.99959e-07 6.72149V40.6381C-0.000203284 41.2268 0.154901 41.8053 0.449785 42.3155C0.74467 42.8258 1.16899 43.25 1.68026 43.5456C2.19153 43.8412 2.77182 43.9979 3.36303 44C3.95425 44.0021 4.53563 43.8495 5.049 43.5575L16.884 36.8225C17.2239 36.6292 17.6086 36.5275 18 36.5275C18.3914 36.5275 18.7761 36.6292 19.116 36.8225L30.951 43.5575C31.4644 43.8495 32.0458 44.0021 32.637 44C33.2282 43.9979 33.8085 43.8412 34.3197 43.5456C34.831 43.25 35.2553 42.8258 35.5502 42.3155C35.8451 41.8053 36.0002 41.2268 36 40.6381V6.72149C36 4.93884 35.2888 3.2292 34.023 1.96868C32.7571 0.708155 31.0402 0 29.25 0H6.75Z" fill="#48547C"/>
                </svg>
              ) : (
                <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                  <defs />
                  <path fill="#48547C" d="M6.75 0C4.95 0 3.24 0.7 1.97 1.96C0.71 3.22 0 4.93 0 6.72L0 40.63C0 41.22 0.15 41.8 0.45 42.31C0.74 42.82 1.16 43.24 1.68 43.54C2.19 43.84 2.77 43.99 3.36 44C3.95 44 4.53 43.84 5.04 43.55L16.88 36.82C17.22 36.62 17.6 36.52 18 36.52C18.39 36.52 18.77 36.62 19.11 36.82L30.95 43.55C31.46 43.84 32.04 44 32.63 44C33.22 43.99 33.8 43.84 34.31 43.54C34.83 43.24 35.25 42.82 35.54 42.31C35.84 41.8 36 41.22 36 40.63L36 6.72C36 4.93 35.28 3.22 34.02 1.96C32.75 0.7 31.04 0 29.25 0L6.75 0ZM4.19 5.69Q4.39 5.2 4.79 4.8Q5.19 4.4 5.67 4.2Q6.16 4 6.75 4L29.25 4Q29.83 4 30.32 4.2Q30.8 4.4 31.2 4.8Q31.6 5.2 31.8 5.69Q32 6.17 32 6.72L32 39.55L21.09 33.34Q20.37 32.93 19.6 32.73Q18.83 32.52 18 32.52Q17.17 32.52 16.4 32.73Q15.62 32.93 14.9 33.34L4 39.55L4 6.72Q4 6.17 4.19 5.69Z" fill-opacity="1.000000" fill-rule="evenodd"/>
                </svg>
              )}
            </button>
            <button onClick={() => handleComparisonButton(device)} className="icon-button" title="Сравнить">
            {devicesToCompareIds !== null && devicesToCompareIds.includes(device.id) ? (
                <svg width="42" height="41.5" viewBox="0 0 42 41.5" fill="none">
                  <path d="M2 2V39.6071C2 39.9766 2.14675 40.3308 2.40796 40.592C2.66917 40.8533 3.02345 41 3.39286 41H41" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.7955 18.7144H9.31334C8.35177 18.7144 7.57227 19.4939 7.57227 20.4554V33.6876C7.57227 34.6491 8.35177 35.4286 9.31334 35.4286H12.7955C13.757 35.4286 14.5366 34.6491 14.5366 33.6876V20.4554C14.5366 19.4939 13.757 18.7144 12.7955 18.7144Z" fill="#48547C" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M25.3306 14.5356H21.8485C20.8869 14.5356 20.1074 15.3151 20.1074 16.2767V33.6874C20.1074 34.649 20.8869 35.4285 21.8485 35.4285H25.3306C26.2922 35.4285 27.0717 34.649 27.0717 33.6874V16.2767C27.0717 15.3151 26.2922 14.5356 25.3306 14.5356Z" fill="#48547C" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M37.8326 8.96436H34.3504C33.3889 8.96436 32.6094 9.74386 32.6094 10.7054V33.6876C32.6094 34.6491 33.3889 35.4286 34.3504 35.4286H37.8326C38.7942 35.4286 39.5737 34.6491 39.5737 33.6876V10.7054C39.5737 9.74386 38.7942 8.96436 37.8326 8.96436Z" fill="#48547C" stroke="#48547C" stroke-width="3.62791" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>            
              ) : (
                <svg width="46" height="45.5" viewBox="0 0 46 45.5" fill="none">
                  <defs/>
                  <path id="Vector1" d="M2 2L2 43.46C2 43.87 2.16 44.26 2.45 44.55C2.73 44.83 3.12 45 3.53 45L45 45" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round" stroke-linecap="round"/>
                  <path id="Vector2" d="M13.9 20.42C14.96 20.42 15.82 21.28 15.82 22.34L15.82 36.93C15.82 37.99 14.96 38.85 13.9 38.85L10.06 38.85C9 38.85 8.14 37.99 8.14 36.93L8.14 22.34C8.14 21.28 9 20.42 10.06 20.42L13.9 20.42Z" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round"/>
                  <path id="Vector3" d="M27.72 15.82C28.78 15.82 29.64 16.68 29.64 17.74L29.64 36.93C29.64 37.99 28.78 38.85 27.72 38.85L23.88 38.85C22.82 38.85 21.96 37.99 21.96 36.93L21.96 17.74C21.96 16.68 22.82 15.82 23.88 15.82L27.72 15.82Z" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round"/>
                  <path d="M41.5 9.67C42.56 9.67 43.42 10.53 43.42 11.59L43.42 36.93C43.42 37.99 42.56 38.85 41.5 38.85L37.66 38.85C36.6 38.85 35.74 37.99 35.74 36.93L35.74 11.59C35.74 10.53 36.6 9.67 37.66 9.67L41.5 9.67Z" stroke="#48547C" stroke-opacity="1.000000" stroke-width="4.000000" stroke-linejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          <img className="photo-card compare" src={require(`../images/category/${device.imageName}.png`)} alt={device.name}/>
          <h2>{device.name}</h2>
          <div className="characteristics">
            <p className="price">{device.price}</p>
            <hr style={{ border: '1px solid rgba(72, 84, 124, 0.2)', width: '330px' }} />
            <ul>
            {device.deviceParameters.map((deviceParameter, index) => (
              <li>
                <span className="parameter">{deviceParameter.name}</span>
                <p className="characteristic">{deviceParameter.value}</p>
                {index === device.deviceParameters.length - 1
                  ? <></> : <hr style={{ border: '1px solid rgba(72, 84, 124, 0.2)', width: '330px', marginTop: "10px" }} />}
              </li>
            ))}
            </ul>
          </div>
          <Link to={`/category/${device.categoryId}`} className="button-detail more button-lk" target="_blank">
            <div className="button-detail info button-lk">
              <div className="button-detail text button-lk">подробнее</div>
              <svg className="button-detail arrow button-lk" width="42.133301" height="42.133301" viewBox="0 0 42.1333 42.1333" fill="none">
                <defs/>
                <rect className="background-arrow" rx="21.066668" width="42.133335" height="42.133335" transform="matrix(-1 0 0 1 42.1333 0)" fill="#EBF7FF" fill-opacity="1.000000"/>
                <path d="M17.11 10.53L27.64 21.06L17.11 31.6" stroke="#48547C" stroke-opacity="1.000000" stroke-width="5.266667" stroke-linejoin="round" stroke-linecap="round"/>
              </svg>
            </div>
          </Link>
        </div>
      ))
      ) : (
        <p style={{ textAlign: 'center'}}>Ваш список оборудования для сравнения пуст.<br/>Добавьте оборудование, чтобы увидеть его здесь.</p>
      )}


      </div>
    </main>
    <Modal active={modalActiveFavorites} setActive={setModalActiveFavorites}>
      <div>
      <h2>Вы можете добавить в&nbsp;избранное <span className="modal-selection">не&nbsp;более&nbsp;4&nbsp;экземпляров</span> оборудования.</h2>
      <p>Если вы хотите добавить новый экземпляр,&nbsp;пожалуйста,&nbsp;удалите один из&nbsp;уже&nbsp;добавленных.</p>
      </div>
    </Modal>
    <Modal active={modalActiveCompare} setActive={setModalActiveCompare}>
      <div>
          <h2>Вы можете сравнивать <span className="modal-selection">не&nbsp;более&nbsp;4&nbsp;экземпляров</span> оборудования одновременно.</h2>
          <p>Если вы хотите добавить новый экземпляр&nbsp;для&nbsp;сравнения,&nbsp;пожалуйста, удалите&nbsp;один&nbsp;из&nbsp;уже добавленных.</p>
      </div>
    </Modal>
    <Modal active={modalActiveCompareCategory} setActive={setModalActiveCompareCategory}>
      <div>
        <h2>Сравнение доступно только для&nbsp;оборудования <span className="modal-selection"><br/>одной&nbsp;категории.</span></h2>
        <p>Пожалуйста, убедитесь, что все выбранные&nbsp;экземпляры&nbsp;оборудования принадлежат одной и той же категории.</p>
      </div>
    </Modal>
    </>
  )
}