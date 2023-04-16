const signUpOverlay = document.getElementById("signUp");
const signInOverlay = document.getElementById("signIn");

const container = document.getElementById("container");

signUpOverlay.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInOverlay.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

function handleSignUp() {
  const form = document.getElementById("signupForm");
  const name = form.elements["name"].value;
  const email = form.elements["email"].value;
  const password = form.elements["password"].value;
  // Send form data to the database
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/signup");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ name, email, password }));
  //console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
}

async function handleSignIn() {
  const form = document.getElementById("signinForm");
  const email = form.elements["email"].value;
  const password = form.elements["password"].value;
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

    if (!data.success) {
      document.getElementById("errorText").innerHTML = data.message;
    } else if (data.success) {
      console.log(data.name);
      console.log(data.email);

      localStorage.setItem("name", data.name);
      localStorage.setItem("email", email);
      window.location.href = "home.html";
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}
