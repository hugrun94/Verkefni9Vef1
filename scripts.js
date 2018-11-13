const API_URL = 'https://apis.is/isnic?domain=';

const program = (() => {
  let input;
  let results;

  function erase(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }


  function el(type, text) {
    const ele = document.createElement(type);
    if (text) {
      ele.appendChild(document.createTextNode(text));
    }
    return ele;
  }
  function showMessage(message) {
    erase(results);
    const error = el('string', message);
    results.appendChild(error);
  }


  function showLoading() {
    const img = el('img');
    img.setAttribute('alt', 'loading gid');
    img.setAttribute('src', 'loading.gif');

    const imageDiv = el('div');
    imageDiv.classList.add('loading');
    imageDiv.appendChild(img);
    imageDiv.appendChild(document.createTextNode('Leita af léni'));

    results.appendChild(imageDiv);
  }
  function showResults(data) {
    erase(results);

    const dataObj = data[0];
    const dlElement = document.createElement('dl');

    const hallo = {
      domain: 'Lén',
      registrantname: 'Skráningaraðili',
      address: 'Heimilisfang',
      city: 'Borg',
      postalCode: 'Póstnúmer',
      country: 'Land',
      phone: 'Sími',
      email: 'Netfang',
      registered: 'Skráð',
      expires: 'Rennur út ',
      lastChange: 'Seinast breytt ',
    };
    let dd;
    let dt;
    if (dataObj) {
      const dateisoreg = new Date(dataObj.registered);
      dataObj.registered = dateisoreg.toISOString().substr(0, 10);

      const dateisoex = new Date(dataObj.expires);
      dataObj.expires = dateisoex.toISOString().substr(0, 10);

      const dateisocha = new Date(dataObj.lastChange);
      dataObj.lastChange = dateisocha.toISOString().substr(0, 10);
    }
    for (const key in dataObj) {
      dd = el('dd', hallo[key]);
      dt = el('dt', dataObj[key]);
      dlElement.appendChild(dd);
      dlElement.appendChild(dt);
    }

    results.appendChild(dlElement);

    if (!dataObj) {
      showMessage('Lén er ekki skráð');
    }
  }


  function fetchResults(plate) {
    let errormsg;
    fetch(`${API_URL}${plate}`)
      .then((data) => {
        if (data.status === 431) {
          errormsg = 'Lén verður að vera strengur';
          throw new Error('Non 200 status');
        } else if (!data.ok) {
          errormsg = 'Villa við að sækja gögn';
          throw new Error('Non 200 status');
        }
        return data.json();
      })
      .then(data => showResults(data.results))
      .catch((error) => {
        console.log(error);
        showMessage(errormsg);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const plate = input.value;
    fetchResults(plate);
    showLoading();
  }


  function init(domains) {
    const form = domains.querySelector('form');
    input = form.querySelector('input');
    results = domains.querySelector('.results');

    form.addEventListener('submit', onSubmit);
  }


  return {
    init,
  };
})();


document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
