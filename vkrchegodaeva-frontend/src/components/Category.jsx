import React, { useEffect, useState } from 'react';
import axios from "axios";
import { config } from "../config.jsx";
import { useLocation, Link, useParams } from 'react-router-dom';
import useDocumentTitle from '../useDocumentTitle';
import '../css/basic.css';
import '../css/category.css';
import Modal from './Modal.jsx';

export function Category () {
  useDocumentTitle("Оборудование");
  const [data, setData] = useState([])
  const { id } = useParams();
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalActiveFavorites, setModalActiveFavorites] = useState(false)
  const [modalActiveFavoritesAuth, setModalActiveFavoritesAuth] = useState(false)
  const [modalActiveCompare, setModalActiveCompare] = useState(false)
  const [modalActiveCompareAuth, setModalActiveCompareAuth] = useState(false)
  const [modalActiveCompareCategory, setModalActiveCompareCategory] = useState(false)
  const [isAuthenticated, setAuthenticated] = useState(false)
  // const [devicesToCompareIds, setDevicesToCompareIds] = useState([])

  const [devicesToCompareIds, setDevicesToCompareIds] = useState(() => {
    // Инициализация состояния из localStorage при первом рендере
    const savedDevices = localStorage.getItem('devicesToCompare');
    return savedDevices ? JSON.parse(savedDevices) : [];
    
    // const savedDevices = JSON.parse(localStorage.getItem('devicesToCompare'));
    // return savedDevices ? savedDevices : [];
  });

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
    const fetchData = async () => {
      setDevicesToCompareIds(JSON.parse(localStorage.getItem('devicesToCompare')))

      console.log("localStorage", JSON.parse(localStorage.getItem('devicesToCompare')))

      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/Category/${id}`, { withCredentials: true });
        setData(response.data)
        setFilteredProducts(response.data.devices)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }

      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/Auth/checkToken`, {withCredentials: true});
        console.log(response.data);
        setAuthenticated(true)
      } catch (error) {
        console.log(error);
        setAuthenticated(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (data && data.devices) {
      const results = data.devices.filter(device =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchQuery, data]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFavoriteButton = async (isFavorite, deviceId) => {
    try {
      if (isFavorite) {
        await axios.delete(`${config.API_BASE_URL}/api/FavoriteDevice/${deviceId}`, { withCredentials: true });
      } else {
        await axios.post(`${config.API_BASE_URL}/api/FavoriteDevice/${deviceId}`, null, { withCredentials: true });
      }
      const updatedData = {
        ...data,
        devices: data.devices.map(device =>
          device.id === deviceId ? { ...device, isFavorite: !isFavorite } : device
        )
      };
      setData(updatedData);
      setFilteredProducts(updatedData.devices);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        setModalActiveFavoritesAuth(true)
      }
      else {
        setModalActiveFavorites(true)
      }
    }
  };

  const handleComparisonButton = (deviceId) => {
    if (!isAuthenticated) {
      setModalActiveCompareAuth(true)
      return;
    }

    const updateComparisonIds = (updatedIds) => {
      setDevicesToCompareIds(updatedIds);
      console.log("Обновление хранилища", updatedIds)
      localStorage.setItem('devicesToCompare', JSON.stringify(updatedIds));
    };

    if (!devicesToCompareIds.includes(deviceId)) {
      if (devicesToCompareIds.length < 4) {
          updateComparisonIds([...devicesToCompareIds, deviceId]);
      } else {
          setModalActiveCompare(true);
      }
    } else {
      updateComparisonIds(devicesToCompareIds.filter(item => item !== deviceId));
    }
  };

  useEffect(() => {
    const savedDevices = localStorage.getItem('devicesToCompare');
    if (savedDevices) {
        setDevicesToCompareIds(JSON.parse(savedDevices));
    }
  }, []);
    // if (!devicesToCompareIds.includes(deviceId)) {
    //   if (devicesToCompareIds.length < 4) {
        
    //     setDevicesToCompareIds(prevIds => {

    //       const updatedIds = [...prevIds, deviceId];
    //       localStorage.setItem('devicesToCompare', JSON.stringify(updatedIds));
    //       return updatedIds;
    //     });
    //     setDevicesToCompareIds([...devicesToCompareIds, deviceId])
    //   }
    //   else {
    //     setModalActiveCompare(true)
    //   }
    // }
    // else {
    //   setDevicesToCompareIds(prevIds => {
    //     const updatedIds = prevIds.filter(item => item !== deviceId);
    //     // Сохранение обновленного состояния в localStorage
    //     localStorage.setItem('devicesToCompare', JSON.stringify(updatedIds));
    //     return updatedIds;
    //   });
    //   // setDevicesToCompareIds(devicesToCompareIds.filter(item => item !== deviceId))
    // }
  // };

  // useEffect(() => {
  //   localStorage.setItem('devicesToCompare', JSON.stringify(devicesToCompareIds));
  //   console.log("UpdStorage", JSON.stringify(devicesToCompareIds))
  // }, [devicesToCompareIds]);

  return (
    <>
    <main classNameName='main-category'>
      <div className="category-list" id="category-list">
            <div className="header-list">
              <div className="navigation">
                <nav>
                  <Link className="lk lk-category" to="/authorization" target='_blank'>
                    <svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none">
                      <defs/>
                      <rect id="background-lk" rx="16.000000" width="32.000000" height="32.000000" fill="#EBF7FF" fill-opacity="1.000000"/>
                      <path id="icon-lk" d="M16 27.37C17.99 27.37 19.95 26.85 21.68 25.85L21.68 22.12C21.68 21.08 21.27 20.07 20.53 19.34C19.79 18.6 18.79 18.18 17.75 18.18L14.25 18.18C13.2 18.18 12.2 18.6 11.46 19.34C10.72 20.07 10.31 21.08 10.31 22.12L10.31 25.85C12.04 26.85 14 27.37 16 27.37ZM24.31 22.12L24.31 23.76C25.82 22.14 26.83 20.11 27.2 17.93C27.58 15.74 27.31 13.5 26.43 11.46C25.55 9.43 24.09 7.7 22.23 6.48C20.38 5.27 18.21 4.62 16 4.62C13.78 4.62 11.61 5.27 9.76 6.48C7.9 7.7 6.44 9.43 5.56 11.46C4.68 13.5 4.41 15.74 4.79 17.93C5.16 20.11 6.17 22.14 7.68 23.76L7.68 22.12C7.68 20.77 8.1 19.45 8.88 18.34C9.66 17.23 10.76 16.4 12.03 15.94C11.37 15.18 10.94 14.24 10.8 13.25C10.65 12.25 10.8 11.23 11.22 10.32C11.64 9.4 12.31 8.62 13.15 8.08C14 7.53 14.99 7.24 16 7.24C17 7.24 17.99 7.53 18.84 8.08C19.68 8.62 20.35 9.4 20.77 10.32C21.19 11.23 21.34 12.25 21.19 13.25C21.05 14.24 20.62 15.18 19.96 15.94C21.23 16.4 22.33 17.23 23.11 18.34C23.89 19.45 24.31 20.77 24.31 22.12ZM16 30C19.71 30 23.27 28.52 25.89 25.89C28.52 23.27 30 19.71 30 16C30 12.28 28.52 8.72 25.89 6.1C23.27 3.47 19.71 2 16 2C12.28 2 8.72 3.47 6.1 6.1C3.47 8.72 2 12.28 2 16C2 19.71 3.47 23.27 6.1 25.89C8.72 28.52 12.28 30 16 30ZM18.62 12.5C18.62 13.19 18.34 13.86 17.85 14.35C17.36 14.84 16.69 15.12 16 15.12C15.3 15.12 14.63 14.84 14.14 14.35C13.65 13.86 13.37 13.19 13.37 12.5C13.37 11.8 13.65 11.13 14.14 10.64C14.63 10.15 15.3 9.87 16 9.87C16.69 9.87 17.36 10.15 17.85 10.64C18.34 11.13 18.62 11.8 18.62 12.5Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
                    </svg>          
                  </Link>
                </nav>
                  <button className="category button-detail lk-category">
                    <div className="category button-detail info lk-category">
                      <Link className="category button-detail text lk-category" to="/#block2" target="_blank">все категории</Link>
                      <svg className="category button-detail arrow lk-category" width="32.000000" height="32.000107" viewBox="0 0 32 32.0001" fill="none">
                        <defs/>
                        <rect id="background-arrow" rx="15.999948" width="31.999895" height="32.000107" transform="matrix(-1 0 0 1 32 0)" fill="#48547C" fill-opacity="1.000000"/>
                        <path d="M11.68 7C10.97 7 10.29 7.28 9.78 7.79C9.28 8.29 9 8.98 9 9.7L9 22.3C9 23.01 9.28 23.7 9.78 24.2C10.29 24.71 10.97 25 11.68 25L17.05 25C17.76 25 18.44 24.71 18.95 24.2C19.45 23.7 19.73 23.01 19.73 22.3L19.73 9.7C19.73 8.98 19.45 8.29 18.95 7.79C18.44 7.28 17.76 7 17.05 7L11.68 7ZM20.89 11.76C21.06 11.59 21.28 11.5 21.52 11.5C21.76 11.5 21.99 11.59 22.15 11.76L25.73 15.36C25.9 15.53 26 15.76 26 16C26 16.23 25.9 16.46 25.73 16.63L22.15 20.23C21.99 20.4 21.76 20.49 21.52 20.48C21.29 20.48 21.07 20.39 20.9 20.22C20.73 20.05 20.64 19.83 20.64 19.59C20.64 19.36 20.73 19.13 20.89 18.96L22.94 16.9L15.26 16.9C15.02 16.9 14.79 16.8 14.63 16.63C14.46 16.46 14.36 16.23 14.36 16C14.36 15.76 14.46 15.53 14.63 15.36C14.79 15.19 15.02 15.1 15.26 15.1L22.94 15.1L20.89 13.03C20.72 12.86 20.63 12.63 20.63 12.4C20.63 12.16 20.72 11.93 20.89 11.76Z" fill="#EBF7FF" fill-opacity="1.000000" fill-rule="evenodd"/>
                      </svg>
                    </div>
                  </button>
              </div>
              <input type="text" className="search-bar" value={searchQuery} onChange={handleSearchChange} placeholder="поиск" id="search-bar" autocomplete="off"/>
            </div>
          <main className="main-content">
            <div className="product">
              <h1 id="category-title">{data.name}</h1>

              {filteredProducts.map((device) => (
                <div className="product-card">
                  <div className="product-image">
                      <img src={require(`../images/category/${device.imageName}.png`)} alt={device.name} />
                      <div className="button-container">
                        <button onClick={() => handleFavoriteButton(device.isFavorite, device.id)} className="icon-button" title="Добавить в избранное">
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
                        <button onClick={() => handleComparisonButton(device.id)} className="icon-button" title="Сравнить">
                        { devicesToCompareIds.includes(device.id) ? (
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
                  </div>
                  <div className="product-info">
                      <h2>{device.name}</h2>
                      <p>{device.description}</p>
                      <h3>Диапазон стоимости:</h3>
                      <p>{device.price}</p>
                      <h3>Технические характеристики:</h3>
                      <ul className='ul-category'>
                        {device.deviceParameters.map((deviceParameter) => (
                          <li className='li-category'>
                          <svg width="31" height="22" viewBox="0 0 31 22" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M30.3189 0.677736C30.755 1.11133 31 1.69933 31 2.31243C31 2.92552 30.755 3.51352 30.3189 3.94711L12.8828 21.2774C12.6523 21.5065 12.3788 21.6882 12.0777 21.8122C11.7766 21.9362 11.4539 22 11.128 22C10.8021 22 10.4794 21.9362 10.1783 21.8122C9.87719 21.6882 9.60362 21.5065 9.3732 21.2774L0.710182 12.6685C0.488 12.4553 0.31078 12.2001 0.188862 11.918C0.0669449 11.6359 0.00277192 11.3325 8.78319e-05 11.0255C-0.00259625 10.7185 0.0562625 10.4141 0.173229 10.1299C0.290196 9.84575 0.462928 9.5876 0.681348 9.3705C0.899767 9.15341 1.1595 8.98172 1.44539 8.86547C1.73128 8.74921 2.0376 8.69071 2.34648 8.69338C2.65536 8.69604 2.96061 8.75983 3.24443 8.88101C3.52824 9.00218 3.78493 9.17833 3.99952 9.39916L11.1272 16.4836L27.028 0.677736C27.244 0.462877 27.5006 0.292433 27.7829 0.176143C28.0652 0.0598545 28.3678 0 28.6735 0C28.9791 0 29.2817 0.0598545 29.564 0.176143C29.8464 0.292433 30.1029 0.462877 30.3189 0.677736Z" fill="#48547C"/>
                          </svg>                          
                          <span className="parameter">{deviceParameter.name}</span>
                          <p className="characteristic">{deviceParameter.value}</p>
                          </li>
                        ))}
                      </ul>
                  </div>
              </div>
              ))}
            </div> 
          </main>
      </div>
      <a href="#" id="scrollToTopBtn" title="Наверх">
        <svg width="82" height="60" viewBox="0 0 82 60" fill="none">
          <rect x="0.5" y="0.5" width="81" height="59" rx="29.5" fill="#48547C" stroke="#CFE7F8"/>
          <path d="M52.095 35.0474L41.0475 24ZM41.0475 24L30 35.0474Z" fill="#48547C"/>
          <path id="background-fix" d="M52.095 35.0474L41.0475 24L30 35.0474" stroke="#CFE7F8" stroke-width="5.26667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>        
      </a>
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
    <Modal active={modalActiveFavoritesAuth} setActive={setModalActiveFavoritesAuth}>
      <div>
          <h2>Добавление оборудования в&nbsp;избранное доступно только <span className="modal-selection">авторизованным&nbsp;пользователям.</span></h2>
          <p>Пожалуйста, войдите в свой аккаунт или&nbsp;зарегистрируйтесь,&nbsp;чтобы использовать&nbsp;эту функцию.</p>
      </div>
    </Modal>
    <Modal active={modalActiveCompareAuth} setActive={setModalActiveCompareAuth}>
      <div>
          <h2>Добавление оборудования для&nbsp;сравнения доступно только <span className="modal-selection">авторизованным&nbsp;пользователям.</span></h2>
          <p>Пожалуйста, войдите в свой аккаунт или&nbsp;зарегистрируйтесь,&nbsp;чтобы использовать&nbsp;эту функцию.</p>
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