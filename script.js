'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.btn-country');
  const countryDiv = document.querySelector('.countries');
  ///////////////////////////////////////

  const renderCountry = (data, className = '') => {
    const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1_000_000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].nativeName}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
    </div>
  </article>
`;
    countryDiv.insertAdjacentHTML('beforeend', html);
    countryDiv.style.cssText = `opacity: 1; margin-bottom: 50px;`;
  };

  //https://restcountries.com/v2/

  const getJSON = (url, errorMsg = 'Something went worong') => {
    return fetch(url).then(response => {
      if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
      return response.json();
    });
  };

  const renderError = msg => {
    countryDiv.insertAdjacentText('beforeend', msg);
    countryDiv.style.cssText = 'opacity: 1; margin-bottom: 20px;';
  };

  const getCountryData = country =>
    //country 1
    getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
      .then(data => {
        renderCountry(data[0]);
        const neighbour = data[0].borders?.[0];
        if (!neighbour) throw new Error('No neighbour found!');

        //country 2
        return getJSON(
          `https://restcountries.com/v2/alpha/${neighbour}`,
          'Country not found'
        );
      })
      .then(data => renderCountry(data, 'neighbour'))
      .catch(err => {
        console.log(`${err} 💣`);
        renderError(`Sometning wrong! 💣💣💣${err}`);
      })
      .finally(
        () => (countryDiv.style.cssText = `opacity: 1; margin-bottom: 50px;`)
      );

  const whereAmI = (lat, lng, errorMsg) => {
    return fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=179397702350665363191x51274`
    )
      .then(response => {
        console.log(response);
        if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log(data);

        return data;
      })
      .then(data => {
        console.log(`You are in ${data.city}, ${data.country}`);

        return fetch(`https://restcountries.com/v2/name/${data.country}`);
      })
      .then(res => {
        if (!res.ok) throw new Error(`${errorMsg} ${res.status}`);
        return res.json();
      })
      .then(data => renderCountry(data[0]))
      .catch(err => console.log(err + '  💥  ' + errorMsg));
  };

  whereAmI(46.295224, 30.648086, 'Something wrong!'); //Chornomsk Ukraine
  whereAmI(52.508, 13.381, 'Something wrong!'); //berlin Germany
  whereAmI(19.037, 72.873, 'Something wrong!'); // Koliwada India
  whereAmI(-33.933, 18.474, 'Something wrong!'); // Cape Town, South America

  btn.addEventListener('click', e => {
    countryDiv.innerHTML = '';
    getCountryData('germany');
  });
});
