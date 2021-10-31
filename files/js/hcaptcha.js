async function onSubmit(token) {
  // const secret = "0x39a9a1c0f35c8bc161da0288799a446d8da43a9a"

  document.getElementById("verify-form").submit()
  // fetch("https://hcaptcha.com/siteverify", {
  //   body: `response=${token}&secret=${secret}`,
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   method: "POST",
  // })
  //   .then((r) => r.json())
  //   .then((d) => console.log(d))
}
