import fs from 'fs';
async function test() {
    try {
        const res = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ filename: "test.jpg", contentType: "image/jpeg" })
        });
        const text = await res.text();
        fs.writeFileSync('error_text.txt', text, 'utf8');
        console.log("Status:", res.status);
    } catch (e) {
        console.error(e);
    }
}
test();
