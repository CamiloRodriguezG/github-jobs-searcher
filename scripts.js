//template para mostar un trabajo en la pagina principal

const jobTemplate = (image, companyName, offerTitle, type, city, time, id) => {
  let date = dateConverter(time);
  return `
        <div class="job-minicontainer" id=${id}>
          <div class="job-image">
            <img loading="lazy" src="${image}" alt="${companyName} logo" />
          </div>
          <div class="job-inf">
            <h5>${companyName}</h5>
            <h3>${offerTitle}</h3>
            <div>
              <div class="full-time">${type}</div>
              <div class="other-inf">
                <div>
                  <i class="fas fa-globe-americas"></i>
                  <p>${city}</p>
                </div>
                <div>
                  <i class="far fa-clock"></i>
                  <p>${date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
};

//template para mostar un trabajo una vez se le de click
const jobCompleteTemplate = (
  hta,
  title,
  type,
  time,
  image,
  companyName,
  city,
  description
) => {
  let date = dateConverter(time);
  return `
      <div class="job-container">
      <div class="job-c-left">
        <div class="back-search">
          <i class="fas fa-arrow-left"></i>
          <p>Back to search</p>
        </div>
        <div>
          <h3>HOW TO APPLY</h3>
            ${hta}
        </div>
      </div>
      <div class="job-c-right">
        <header class="job-header">
          <div class="job-title">
            <h1>${title}</h1>
            <div class="full-time">${type}</div>
          </div>
          <div class="job-time">
            <i class="far fa-clock"></i>
            <p>${date}</p>
          </div>
          <div class="job-company-inf">
            <div>
              <img src=${image} alt=${companyName}></img>
            </div>
            <div>
              <h4>${companyName}</h4>
              <div>
                <i class="fas fa-globe-americas"></i>
                <p>${city}</p>
              </div>
            </div>
          </div>
        </header>
        ${description}
      </div>
    </div>
  `;
};

//las fechas se dan asi (Mon Mar 22 18:58:08 UTC 2021) y se pasan
//a "hace 4 dias", "hace 3 horas" o "hace 1 hora" como ejemplos.
const dateConverter = (date) => {
  let dateToConvert = new Date(date).getTime();
  let now = Date.now();
  if ((now - dateToConvert) / (1000 * 60 * 60 * 24) > 1) {
    if ((now - dateToConvert) / (1000 * 60 * 60) < 2) {
      return `${Math.floor(
        (now - dateToConvert) / (1000 * 60 * 60 * 24)
      )} day ago.`;
    }
    return `${Math.floor(
      (now - dateToConvert) / (1000 * 60 * 60 * 24)
    )} days ago.`;
  } else if ((now - dateToConvert) / (1000 * 60 * 60) > 1) {
    if ((now - dateToConvert) / (1000 * 60 * 60) < 2) {
      return `${Math.floor(
        (now - dateToConvert) / (1000 * 60 * 60)
      )} hour ago.`;
    }
    return `${Math.floor((now - dateToConvert) / (1000 * 60 * 60))} hours ago.`;
  }
};

let jobsContainer = document.querySelector(".jobs-container");
let page = 1; //pagina (o indice del array jobs) en el que esta el usuario
let jobs = []; //array en cada indice tiene 5 trabajos encontrados

//se actualiza la pagina en la que esta el usuario, es decir se renderizan los trabajos del
//del array jobs (jobs[page]) y tambien se renderizan los botones con setButtons()
const goToPage = () => {
  // console.log(jobs);
  if (jobs.length < 1) {
    //en el caso de que no se hayan encontrado trabajos
    jobsContainer.innerHTML = "<h1>No Jobs found</h1>";
  } else {
    if (jobs[0].length === 1) {
      //en el caso en el que solo haya un trabajo encontrado
      jobsContainer.innerHTML = jobs[0];
      jobsContainer.querySelectorAll(".job-minicontainer").forEach((job) => {
        //a cada minicontainer de un trabajo se le agrega un event listener
        //para que cuando se presione consulte la API, y mande la data a la funcion GoToJob()
        job.addEventListener(
          "click",
          function (job) {
            document.querySelector("body").innerHTML = `
              <h1 class="loading">Loading
                <span class="s1">.</span>
                <span class="s2">.</span>
                <span class="s3">.</span>
              </h1>
              `;
            fetch(
              `https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions/${job.srcElement.id}.json`
            )
              .then((response) => response.json())
              .then((response) => {
                goToJob(response);
              });
          },
          true
        );
      });
    } else {
      jobsContainer.innerHTML = jobs[page - 1].join("");
      jobsContainer.innerHTML += `<div class="move-buttons"></div>`;
      jobsContainer.querySelectorAll(".job-minicontainer").forEach((job) => {
        job.addEventListener(
          "click",
          function (job) {
            //este inner html se pone en mas lados, es para indicar que esta en carga
            //hasta que se retorne la data de la API
            document.querySelector("body").innerHTML = `
                <h1 class="loading">Loading
                  <span class="s1">.</span>
                  <span class="s2">.</span>
                  <span class="s3">.</span>
                </h1>
                `;
            fetch(
              `https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions/${job.srcElement.id}.json`
            )
              .then((response) => response.json())
              .then((response) => goToJob(response));
          },
          true
        );
      });
    }
    setButtons();
  }
};

//crea un boton por cada indice del array jobs, y les da events listeners
//para que cuando se presionen cambien el valor de page, y llamen a la funcion goToPage()
const setButtons = () => {
  if (jobs.length > 1) {
    let moveButtons = document.querySelector(".move-buttons");
    const buttons = [];
    for (let i = 0; i < jobs.length; i++) {
      if (i + 1 === page) {
        buttons.push(
          `<button class="move-btn btn-active" value=${i + 1}>${i + 1}</button>`
        );
      } else {
        buttons.push(
          `<button class="move-btn" value=${i + 1}>${i + 1}</button>`
        );
      }
    }
    moveButtons.innerHTML += `<button class="prev-btn"><</button>`;
    moveButtons.innerHTML += buttons.join("");
    moveButtons.innerHTML += `<button class="next-btn">></button>`;
    moveButtons.querySelectorAll(".move-btn").forEach((button) => {
      button.addEventListener("click", function () {
        page = parseInt(button.value);
        goToPage();
      });
    });
    moveButtons
      .querySelector(".next-btn")
      .addEventListener("click", function () {
        page++;
        goToPage();
      });
    moveButtons
      .querySelector(".prev-btn")
      .addEventListener("click", function () {
        page--;
        goToPage();
      });
  }
};

//Es la funcion que se llama una vez cargada la pagina, trae todos los trabajos que la
//API permite traer para luego organizarlos con la funcion goToPage()
const fillJobs = () => {
  jobsContainer.innerHTML = `
  <h1 class="loading">Loading
    <span class="s1">.</span>
    <span class="s2">.</span>
    <span class="s3">.</span>
  </h1>
  `;
  const URL = `https://jobs.github.com/positions.json`;
  fetch(URL)
    .then((res) => res.json())
    .then((res) => {
      for (let i = 0; i < res.length; i++) {
        let page = [];
        for (let j = i; j < i + 5; j++) {
          let image = res[j].company_logo;
          let companyName = res[j].company;
          let offerTitle = res[j].title;
          let type = res[j].type;
          let city = res[j].location;
          let time = res[j].created_at;
          let id = res[j].id;
          page.push(
            jobTemplate(image, companyName, offerTitle, type, city, time, id)
          );
        }
        i += 4;
        jobs.push(page);
      }
      goToPage();
    });
};

//es el observador de cuando en el input para ciudades cambie se haga un llamado
//a la API y al igual que con fillJobs() organize la data con la funcion goToPage()
const searchByCity = () => {
  page = 1;
  jobs = [];
  jobsContainer.innerHTML = `
  <h1 class="loading">Loading
    <span class="s1">.</span>
    <span class="s2">.</span>
    <span class="s3">.</span>
  </h1>
  `;
  let city = document.querySelector(".search-city-country input").value;
  const URL = `https://jobs.github.com/positions.json?location=${city}`;
  fetch(URL)
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (res.length < 1) {
        jobs = [];
      } else {
        if (res.length > 5) {
          let jo = 0;
          let pages = Math.abs(res.length / 5) + 1;
          for (let i = 0; i < pages; i++) {
            let page = [];
            for (let j = jo; j < jo + 5; j++) {
              let image = res[j].company_logo;
              let companyName = res[j].company;
              let offerTitle = res[j].title;
              let type = res[j].type;
              let city = res[j].location;
              let time = res[j].created_at;
              let id = res[j].id;
              page.push(
                jobTemplate(
                  image,
                  companyName,
                  offerTitle,
                  type,
                  city,
                  time,
                  id
                )
              );
              if (j + 2 > res.length) {
                break;
              }
            }
            jo += 4;
            jobs.push(page);
          }
        } else {
          jobs = [
            res.map((job) => {
              let image = job.company_logo;
              let companyName = job.company;
              let offerTitle = job.title;
              let type = job.type;
              let city = job.location;
              let time = job.created_at;
              let id = job.id;
              return jobTemplate(
                image,
                companyName,
                offerTitle,
                type,
                city,
                time,
                id
              );
            }),
          ];
          // console.log(jobs);
        }
      }
      goToPage();
    });
};

//es el observador de cuando alguno de los filtros por ciudades o Full-time es seleccionado o
//deseleccionado, para luego llamar a la API y al igual que con fillJobs() organize la data con
//la funcion goToPage()
const searchByFilters = () => {
  page = 1;
  jobs = [];
  let fullTime = document.getElementById("full-time").checked;
  let cities = document.querySelectorAll(".radio-button-city");
  let location = "";
  jobsContainer.innerHTML = `
  <h1 class="loading">Loading
    <span class="s1">.</span>
    <span class="s2">.</span>
    <span class="s3">.</span>
  </h1>
  `;
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].checked) {
      location = cities[i].value;
    }
  }
  const URLnew = `https://jobs.github.com/positions.json?full_time=${fullTime}&location=${location}`;
  // console.log(URLnew);
  fetch(URLnew)
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (res.length < 2) {
        let image = res[0].company_logo;
        let companyName = res[0].company;
        let offerTitle = res[0].title;
        let type = res[0].type;
        let city = res[0].location;
        let time = res[0].created_at;
        let id = res[0].id;
        jobs = [
          [jobTemplate(image, companyName, offerTitle, type, city, time, id)],
        ];
      } else {
        if (res.length > 5) {
          let jo = 0;
          let pages = Math.abs(res.length / 5) + 1;
          for (let i = 0; i < pages; i++) {
            let page = [];
            for (let j = jo; j < jo + 5; j++) {
              let image = res[j].company_logo;
              let companyName = res[j].company;
              let offerTitle = res[j].title;
              let type = res[j].type;
              let city = res[j].location;
              let time = res[j].created_at;
              let id = res[j].id;
              page.push(
                jobTemplate(
                  image,
                  companyName,
                  offerTitle,
                  type,
                  city,
                  time,
                  id
                )
              );
              if (j + 2 > res.length) {
                break;
              }
            }
            jo += 4;
            jobs.push(page);
          }
        } else {
          jobs = [
            res.map((job) => {
              let image = job.company_logo;
              let companyName = job.company;
              let offerTitle = job.title;
              let type = job.type;
              let city = job.location;
              let time = job.created_at;
              let id = job.id;
              return jobTemplate(
                image,
                companyName,
                offerTitle,
                type,
                city,
                time,
                id
              );
            }),
          ];
          // console.log(jobs);
        }
      }
      goToPage();
    });
};

//funciona igual que las 3 funciones anteriores pero esta es con el input principal
//que busca por alguna descripcion (input que tiene boton search)
const searchByDescription = () => {
  let description = document.querySelector(".search-input").value;
  if (description.replace(/\s/g, "") !== "") {
    jobsContainer.innerHTML = `
    <h1 class="loading">Loading
      <span class="s1">.</span>
      <span class="s2">.</span>
      <span class="s3">.</span>
    </h1>
    `;
    page = 1;
    jobs = [];
    const URL = `https://jobs.github.com/positions.json?description=${description}`;
    fetch(URL)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        if (res.length < 2) {
          jobs = [...res];
        } else {
          if (res.length > 5) {
            let jo = 0;
            let pages = Math.abs(res.length / 5) + 1;
            for (let i = 0; i < pages; i++) {
              let page = [];
              for (let j = jo; j < jo + 5; j++) {
                let image = res[j].company_logo;
                let companyName = res[j].company;
                let offerTitle = res[j].title;
                let type = res[j].type;
                let city = res[j].location;
                let time = res[j].created_at;
                let id = res[j].id;
                page.push(
                  jobTemplate(
                    image,
                    companyName,
                    offerTitle,
                    type,
                    city,
                    time,
                    id
                  )
                );
                if (j + 2 > res.length) {
                  break;
                }
              }
              jo += 4;
              jobs.push(page);
            }
          } else {
            jobs = [
              res.map((job) => {
                let image = job.company_logo;
                let companyName = job.company;
                let offerTitle = job.title;
                let type = job.type;
                let city = job.location;
                let time = job.created_at;
                let id = job.id;
                return jobTemplate(
                  image,
                  companyName,
                  offerTitle,
                  type,
                  city,
                  time,
                  id
                );
              }),
            ];
            console.log(jobs);
          }
        }
        goToPage();
      });
  } else {
    document.querySelector(".no-input-err").classList.remove("err-close");
    document.querySelector(".search-input").value = "";
  }
};

//funcion para cerrar una ventana que emerge cuando se da a serach con input vacio
const cerrar = () => {
  console.log("cerrado");
  let err = document.querySelector(".no-input-err");
  err.classList.add("err-close");
};

//es la funcion que se llama cuando algun trabajo es clickeado, vuelve a llamar a la API, esta
//vez con la ID del trabajo y envia la data jobCompleteTemplate() para luego insertarlo dentro
//de body
const goToJob = (data) => {
  const header = `
  <header>
    <h1>
      GitHub
      <p>Jobs</p>
    </h1>
  </header>
  `;
  const footer = `
    <footer>
      <p>created by <a href="https://portfolio-mu-snowy.vercel.app/" target="_blank">Camilo Rodriguez</a> - devChallenges.io</p>
    </footer>
  `;
  const howToApply = data.how_to_apply;
  const offerTitle = data.title;
  const image = data.company_logo;
  const companyName = data.company;
  const type = data.type;
  const city = data.location;
  const time = data.created_at;
  const description = data.description;
  body = document.querySelector("body");
  body.innerHTML = header;
  body.innerHTML += jobCompleteTemplate(
    howToApply,
    offerTitle,
    type,
    time,
    image,
    companyName,
    city,
    description
  );
  body.innerHTML += footer;
  document.querySelector(".back-search").addEventListener("click", function () {
    body.innerHTML = header;
    body.innerHTML += `
    <div class="no-input-err err-close">
      <p>Opps, you didn't write nothing to search</p>
      <button class="close-err-btn"  onclick="cerrar()"><i class="fas fa-times-circle"></i></button>
    </div>
    `;
    body.innerHTML += `
      <section class="search-sec"> 
        <div class="search-container">
          <i class="fas fa-briefcase"></i>
          <input
            type="text"
            class="search-input"
            placeholder="Title, companies, expertise or benefits"
          />
          <button class="search-btn" onclick="searchByDescription()">Search</button>
        </div>
      </section>
      <div class="main-container">
        <div class="filter-container">
          <div>
            <input
              type="checkbox"
              name="fulltime"
              id="full-time"
              onchange="searchByFilters()"
            />
            <label for="fulltime">Full-time</label>
          </div>
          <h4>LOCATION</h4>
          <div class="search-city-country">
            <i class="fas fa-globe-americas"></i>
            <input type="text" placeholder="City, state, zip code or country" onchange="searchByCity()"/>
          </div>
          <div>
            <input type="radio" name="radiobutton" class="radio-button-city" id="london-radio" value="london" onchange="searchByFilters()" />
            <label for="london">London</label>
          </div>
          <div>
            <input type="radio" name="radiobutton" class="radio-button-city" id="amsterdam-radio" value="amsterdam" onchange="searchByFilters()" />
            <label for="amsterdam">Amsterdam</label>
          </div>
          <div>
            <input type="radio" name="radiobutton" class="radio-button-city" id="newyork-radio" value="newyork" onchange="searchByFilters()" />
            <label for="newyork">New york</label>
          </div>
          <div>
            <input type="radio" name="radiobutton" class="radio-button-city" id="berlin-radio" value="berlin" onchange="searchByFilters()" />
            <label for="berlin">Berlin</label>
          </div>
        </div>
        <section class="jobs-container">
          <div class="move-buttons">
          </div>
        </section>
      </div>
  `;
    body.innerHTML += footer;
    jobsContainer = document.querySelector(".jobs-container");
    goToPage();
  });
  // console.log(data);
};

//una vez carga el doc llama a la funcion fillJobs()
document.onload = fillJobs();
