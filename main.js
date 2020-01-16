let select, 
	userDog, 
	userBmi, 
	selectedBreed,
	output,
	url;

const fetchDogs = async () => {

// https://docs.thedogapi.com/
const api = `https://api.thedogapi.com/v1/breeds/?format=json&key=95fddee-9abb-4922-b49b-dd17290f83e5?`;

const req = new Request(api, {method:'GET'});

const data = await fetch(req).then(data => data.json())
popDoggoSelect(data);


// User submits data
const modal = document.querySelector('#modal');
const modalBtn = document.querySelector('#modal-btn');
const close = document.querySelector('.close');
modalBtn.addEventListener('click', modalOpen);
close.addEventListener('click', modalClose);
window.addEventListener('click', clickOut);

// Open
function modalOpen () { modal.style.display = 'block'; getAPIData(); };

// Close
function modalClose () { modal.style.display = 'none'; };

// If outside Modal
function clickOut(e) {
  if (e.target == modal) {
	modal.style.display = 'none';
  }
}

const getAPIData = () => {
	// Set selection IDs
	selectedBreed = pupperDropDown.options[pupperDropDown.selectedIndex].id;
	// Build new API URL
	url = `https://api.thedogapi.com/v1/breeds/${selectedBreed}/`
	// Fetch selection data from new URL
	fetch(url)
	.then(res => {
	return res.json();
})
	.then(data => calculateBMI(data));
}};


// Convert string returned from JSON into integers
const extractIntFromStr = (str) =>{
    return str.split(" - ")
        .filter(value => !isNaN(value))
        .map(value => parseInt(value));
};

// Calculate the BMIs
const calculateBMI = (data) => {

	// Create user's dog object
	userDog = {
		breed : pupperDropDown.value,
		height : parseInt(document.getElementById('height').value),
		weight : parseInt(document.getElementById('weight').value),
		};

	// Weight (in lbs) * 703 / (Height(in inches)^2)
	userBmi = Math.round(userDog.weight * 703 / (userDog.height * userDog.height));


	// Min. Avg. Weight of breed
	const apiWeightMin = Math.round(Math.min(...extractIntFromStr(data.weight.imperial)));

	// Min. Avg. Height of breed
	const apiHeightMin = Math.round(Math.min(...extractIntFromStr(data.height.imperial)));

	// Max. Avg. Weight of breed
	const apiWeightMax = Math.round(Math.max(...extractIntFromStr(data.weight.imperial)));

	// Max. Avg. Height of breed
	const apiHeightMax = Math.round(Math.max(...extractIntFromStr(data.height.imperial)));


	// Calculate Min. Array BMI (Weight (in lbs) * 703 / (Height(in inches)^2))
	const apiBmiMin = Math.round(apiWeightMin * 703 / (apiHeightMin * apiHeightMin));

	// Calculate Max. Array BMI (Weight (in lbs) * 703 / (Height(in inches)^2))
	const apiBmiMax = Math.round(apiWeightMax * 703 / (apiHeightMax * apiHeightMax));

	// Results of comparing UserBMI with The Avg. BMI of their specified breed
	if(userBmi > apiBmiMax){
		output = 
		`<p class="initial">Your <strong>${userDog.breed}</strong> has a calculated BMI  of <strong>${userBmi}</strong></p>.
		<br>
		A healthy BMI for this breed is <strong>${apiBmiMin} - ${apiBmiMax}</strong>. This means it is potentially <strong>overweight</strong>.
		<br>
		<br>
		A healthy weight for this breed is considered to be <strong>${data.weight.imperial} pounds</strong>, with an average height of <strong>${data.height.imperial} inches</strong> at the shoulders.`;
	};

	if(userBmi < apiBmiMin){
		output =
 		`<p class="initial">Your <strong>${userDog.breed}</strong> has a calculated BMI  of <strong>${userBmi}</strong></p>.
		<br>
		A healthy BMI for this breed is <strong>${apiBmiMin} - ${apiBmiMax}</strong>. This means it is potentially <strong>underweight</strong>.
		<br>
		<br>
		A healthy weight for this breed is considered to be <strong>${data.weight.imperial} pounds</strong>, with an average height of <strong>${data.height.imperial} inches</strong> at the shoulders.`;
	}
	
	else if (userBmi >= apiBmiMin && userBmi <= apiBmiMax) {
		output = 
		`<p class="initial"><strong>CONGRATULATIONS!</strong>
		<br>
		<br>
		Your <strong>${userDog.breed}</strong> is healthy and has a calculated BMI  of <strong>${userBmi}</strong></p>.
		<br>
		A healthy BMI for this breed is considered to be <strong>${apiBmiMin} - ${apiBmiMax}</strong>.
		<br>
		<br>
		A healthy weight for this breed is considered to be <strong>${data.weight.imperial} pounds</strong>, with an average height of <strong>${data.height.imperial} inches</strong> at the shoulders.`;
	};

	// Output results into modal
	document.getElementById('results').innerHTML = output;
};


// Populate select form with API data
const popDoggoSelect = (data) => {
  select = document.querySelector('.pupperDropDown');
  const breedOps = data.map(data => {
    const option = document.createElement('option');
	option.text = data.name,
	
	option.value = 
	data.name, 
	data.weight.imperial, 
	data.height.imperial

	option.id = data.id;
	return option;
	
  })

breedOps.forEach(breedOption => {
	select.appendChild(breedOption);
	
  })
};

fetchDogs();


// IntersectionObserver
function interObs() {
	document.addEventListener("DOMContentLoaded", () => {
		let options = {
			root: null,
			rootMargin: "-250px -50px",
			threshold: 0.06
		};
		let observer = new IntersectionObserver(touching, options);
		document.querySelectorAll("img").forEach(img => {
			observer.observe(img);
		});
	});
	touching = (selections) => {
		selections.forEach(selection => {
			if (selection.isIntersecting) {
				selection.target.classList.add("active");
			}
			else {
				selection.target.classList.remove("active");
			}
		});
	};
}

interObs();