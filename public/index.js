document.querySelector("#domainbtn1").addEventListener("click", () => {
    copydDomain();
})
document.querySelector("#domainbtn2").addEventListener("click", () => {
    copydDomain();
})


function copydDomain() {
    let copyText = "https://myapi.cyclic.app/"
    navigator.clipboard.writeText(copyText);
}
