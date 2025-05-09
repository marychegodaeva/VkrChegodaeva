import React, { useEffect, useState } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import axios from "axios";
import { config } from "../config.jsx";
import '../css/basic.css';
import '../css/block_1.css';
import '../css/block_2.css';
import '../css/block_3.css';
import '../css/block_4.css';
import neft_skv1 from '../images/main/neft_skv1.svg';
import neft_skv2 from '../images/main/neft_skv2.svg';
import map from '../images/main/map.svg';


export function MainPage () {
  const location = useLocation();
  const [data, setData] = useState([])

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
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/Category`, { withCredentials: true });
            setData(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    fetchData()
  }, [])

  return (
    <>
    <nav className='nav-main'>
      <Link className="lk" to="/authorization" target="_blank">
        <svg width="32.000000" height="32.000000" viewBox="0 0 32 32" fill="none">
          <defs/>
          <rect id="background-lk-main" rx="16.000000" width="32.000000" height="32.000000" fill="#EBF7FF" fill-opacity="1.000000"/>
          <path d="M16 27.37C17.99 27.37 19.95 26.85 21.68 25.85L21.68 22.12C21.68 21.08 21.27 20.07 20.53 19.34C19.79 18.6 18.79 18.18 17.75 18.18L14.25 18.18C13.2 18.18 12.2 18.6 11.46 19.34C10.72 20.07 10.31 21.08 10.31 22.12L10.31 25.85C12.04 26.85 14 27.37 16 27.37ZM24.31 22.12L24.31 23.76C25.82 22.14 26.83 20.11 27.2 17.93C27.58 15.74 27.31 13.5 26.43 11.46C25.55 9.43 24.09 7.7 22.23 6.48C20.38 5.27 18.21 4.62 16 4.62C13.78 4.62 11.61 5.27 9.76 6.48C7.9 7.7 6.44 9.43 5.56 11.46C4.68 13.5 4.41 15.74 4.79 17.93C5.16 20.11 6.17 22.14 7.68 23.76L7.68 22.12C7.68 20.77 8.1 19.45 8.88 18.34C9.66 17.23 10.76 16.4 12.03 15.94C11.37 15.18 10.94 14.24 10.8 13.25C10.65 12.25 10.8 11.23 11.22 10.32C11.64 9.4 12.31 8.62 13.15 8.08C14 7.53 14.99 7.24 16 7.24C17 7.24 17.99 7.53 18.84 8.08C19.68 8.62 20.35 9.4 20.77 10.32C21.19 11.23 21.34 12.25 21.19 13.25C21.05 14.24 20.62 15.18 19.96 15.94C21.23 16.4 22.33 17.23 23.11 18.34C23.89 19.45 24.31 20.77 24.31 22.12ZM16 30C19.71 30 23.27 28.52 25.89 25.89C28.52 23.27 30 19.71 30 16C30 12.28 28.52 8.72 25.89 6.1C23.27 3.47 19.71 2 16 2C12.28 2 8.72 3.47 6.1 6.1C3.47 8.72 2 12.28 2 16C2 19.71 3.47 23.27 6.1 25.89C8.72 28.52 12.28 30 16 30ZM18.62 12.5C18.62 13.19 18.34 13.86 17.85 14.35C17.36 14.84 16.69 15.12 16 15.12C15.3 15.12 14.63 14.84 14.14 14.35C13.65 13.86 13.37 13.19 13.37 12.5C13.37 11.8 13.65 11.13 14.14 10.64C14.63 10.15 15.3 9.87 16 9.87C16.69 9.87 17.36 10.15 17.85 10.64C18.34 11.13 18.62 11.8 18.62 12.5Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
        </svg>          
      </Link>
      <div className="lk section">
        <a className="lk section item" href="#block2">оборудование</a>
        <a className="lk section item" href="#block3">партнеры</a>
        <a className="lk section item" href="#block4">контакты</a>
      </div>
    </nav>
    <div className="block1" id="block1">
      <img src={neft_skv1} alt="Фон с нефтяной скважиной" className="background-image"/>
      <div className="content">
          <h1>Справочник оборудования для строительства <span className="light-purple-selection">нефтяных</span> скважин</h1>
      </div>
    </div>
    <div className="block2" id="block2">
      {data && data.map((category, index) => (
        <div className={index === data.length - 1 ? "category last" : "category"}>
        <img src={require(`../images/main/${category.imageName}.svg`)} alt={category.name} className="category-image"/>
        <div className="category-content">
          <div className="category-header">
            <h2>{category.name}</h2>
            <Link to={`/category/${category.id}`} className="button-detail" target="_blank">
              <div className="button-detail info">
                <div className="button-detail text">подробнее</div>
                <svg className="button-detail arrow" width="42.133301" height="42.133301" viewBox="0 0 42.1333 42.1333" fill="none">
                  <defs/>
                  <rect className="background-arrow" rx="21.066668" width="42.133335" height="42.133335" transform="matrix(-1 0 0 1 42.1333 0)" fill="#EBF7FF" fill-opacity="1.000000"/>
                  <path d="M17.11 10.53L27.64 21.06L17.11 31.6" stroke="#48547C" stroke-opacity="1.000000" stroke-width="5.266667" stroke-linejoin="round" stroke-linecap="round"/>
                </svg>
              </div>
            </Link>
          </div>
          <p>{category.description}</p>
        </div>
      </div>
      ))}
    </div>
    <div className="block3" id="block3">
      <h2>Наши партнёры</h2>
      <div className="partner-content">
          <div className="partner">
            <div className="partner-title">
              <svg width="31.000000" height="22.000000" viewBox="0 0 31 22" fill="none">
                <defs/>
                <path id="Иконка Пункт" d="M30.31 0.67C30.75 1.11 31 1.69 31 2.31C31 2.92 30.75 3.51 30.31 3.94L12.88 21.27C12.65 21.5 12.37 21.68 12.07 21.81C11.77 21.93 11.45 22 11.12 22C10.8 22 10.47 21.93 10.17 21.81C9.87 21.68 9.6 21.5 9.37 21.27L0.71 12.66C0.48 12.45 0.31 12.2 0.18 11.91C0.06 11.63 0 11.33 0 11.02C-0.01 10.71 0.05 10.41 0.17 10.12C0.29 9.84 0.46 9.58 0.68 9.37C0.89 9.15 1.15 8.98 1.44 8.86C1.73 8.74 2.03 8.69 2.34 8.69C2.65 8.69 2.96 8.75 3.24 8.88C3.52 9 3.78 9.17 3.99 9.39L11.12 16.48L27.02 0.67C27.24 0.46 27.5 0.29 27.78 0.17C28.06 0.05 28.36 0 28.67 0C28.97 0 29.28 0.05 29.56 0.17C29.84 0.29 30.1 0.46 30.31 0.67Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
              </svg>            
              <h3>«Новомет-Пермь»</h3>
            </div>
            <p>Ведущий <span className="light-purple-selection">производитель буровых установок</span> и оборудования для глубокого бурения.</p>
          </div>
          <div className="partner">
            <div className="partner-title n2">
              <svg width="31.000000" height="22.000000" viewBox="0 0 31 22" fill="none">
                <defs/>
                <path d="M30.31 0.67C30.75 1.11 31 1.69 31 2.31C31 2.92 30.75 3.51 30.31 3.94L12.88 21.27C12.65 21.5 12.37 21.68 12.07 21.81C11.77 21.93 11.45 22 11.12 22C10.8 22 10.47 21.93 10.17 21.81C9.87 21.68 9.6 21.5 9.37 21.27L0.71 12.66C0.48 12.45 0.31 12.2 0.18 11.91C0.06 11.63 0 11.33 0 11.02C-0.01 10.71 0.05 10.41 0.17 10.12C0.29 9.84 0.46 9.58 0.68 9.37C0.89 9.15 1.15 8.98 1.44 8.86C1.73 8.74 2.03 8.69 2.34 8.69C2.65 8.69 2.96 8.75 3.24 8.88C3.52 9 3.78 9.17 3.99 9.39L11.12 16.48L27.02 0.67C27.24 0.46 27.5 0.29 27.78 0.17C28.06 0.05 28.36 0 28.67 0C28.97 0 29.28 0.05 29.56 0.17C29.84 0.29 30.1 0.46 30.31 0.67Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
              </svg>            
              <h3>«НефтеПром Насосы»</h3>
            </div>
            <p>Компания, специализирующаяся <span className="light-purple-selection">на&nbsp;производстве насосного оборудования</span> для&nbsp;перекачивания нефти и других жидкостей.</p>
          </div>
          <div className="partner">
              <div className="partner-title n3">
                <svg width="31.000000" height="22.000000" viewBox="0 0 31 22" fill="none">
                  <defs/>
                  <path d="M30.31 0.67C30.75 1.11 31 1.69 31 2.31C31 2.92 30.75 3.51 30.31 3.94L12.88 21.27C12.65 21.5 12.37 21.68 12.07 21.81C11.77 21.93 11.45 22 11.12 22C10.8 22 10.47 21.93 10.17 21.81C9.87 21.68 9.6 21.5 9.37 21.27L0.71 12.66C0.48 12.45 0.31 12.2 0.18 11.91C0.06 11.63 0 11.33 0 11.02C-0.01 10.71 0.05 10.41 0.17 10.12C0.29 9.84 0.46 9.58 0.68 9.37C0.89 9.15 1.15 8.98 1.44 8.86C1.73 8.74 2.03 8.69 2.34 8.69C2.65 8.69 2.96 8.75 3.24 8.88C3.52 9 3.78 9.17 3.99 9.39L11.12 16.48L27.02 0.67C27.24 0.46 27.5 0.29 27.78 0.17C28.06 0.05 28.36 0 28.67 0C28.97 0 29.28 0.05 29.56 0.17C29.84 0.29 30.1 0.46 30.31 0.67Z" fill="#48547C" fill-opacity="1.000000" fill-rule="evenodd"/>
                </svg>            
                <h3>«ЭкоТруб Индустрия»</h3>
              </div>
            <p>Разработчик <span className="light-purple-selection">систем контроля&nbsp;и&nbsp;управления</span> для&nbsp;нефтедобывающей отрасли.</p>
          </div>
      </div>
      <svg className="partner-image" width="854.000000" height="801.000000" viewBox="0 0 854 801" fill="none">
        <defs>
          <pattern id="pattern_4_4000" patternContentUnits="objectBoundingBox" width="1.000000" height="1.000000">
            <use transform="matrix(0.00094,0,0,0.00078,0,-0.000086)"/>
          </pattern>
          <image id="image4_400_0" width="1064.000000" height="1283.000000"/>
        </defs>
        <rect id="Фон Фото Блок 3" y="266.000000" rx="50.000000" width="854.000000" height="517.000000" fill="#48547C" fill-opacity="0"/>
        <rect id="background-partner-image" y="266.000000" rx="50.000000" width="854.000000" height="517.000000" fill="#48547C" fill-opacity="1.000000"/>
        <mask id="mask4_401" mask-type="alpha" maskUnits="userSpaceOnUse" x="0.000000" y="0.000000" width="854.000000" height="801.000000">
          <rect id="Форма Фото Блок 3" rx="50.000000" width="854.000000" height="801.000000" fill="#96AED3" fill-opacity="1.000000"/>
        </mask>
        <image className="partner-image" href={neft_skv2} />
      </svg>      
    </div>
    <div className="block4" id="block4">
      <h2>О компании</h2>
      <p>Компания <span className="light-purple-selection">«НефтеСправочник»</span> была основана <span className="light-purple-selection">в 2010 году</span> с целью предоставления надежной и актуальной информации о современном оборудовании для нефтедобычи.</p>
      <p><span className="light-purple-selection">Наша миссия</span> — помочь специалистам в строительстве нефтяных скважин <span className="light-purple-selection">выбирать лучшее оборудование</span>, способствуя эффективной и безопасной добыче нефти.</p>
      <p><span className="light-purple-selection">Мы гордимся</span> тем, что наш справочник стал <span className="light-purple-selection">незаменимым инструментом</span> для инженеров, менеджеров и техников, работающих в этой важной отрасли.</p>
      <div className="map-container">
          <img src={map} alt="Карта" className="company-map"/>
          <div className="contact-info">
              <p><span className="light-purple-selection">Адрес:</span><br/><a href="https://yandex.ru/maps/-/CHbMaV31" target='_blank'>ул. Нефтяников, 123,<br/>г. Нефтеюганск, Россия</a></p>
              <p><span className="light-purple-selection">Телефон:</span><br/><a href="tel:+71234567890" target='_blank'>+7 (123) 456-78-90</a></p>
              <p className="last"><span className="light-purple-selection">Электронная почта:</span><br/><a href="mailto:info@neftespravochnik.ru" target='_blank'>info@neftespravochnik.ru</a></p>
          </div>
      </div>
      <p className="footer">© 2025 НефтеСправочник. Все права защищены.</p>
    </div>
    </>
  )
}