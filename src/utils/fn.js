export async function register(data) {
   try {
    const res = await client.post("/Auth/register", data);
   //f (!res.ok) { throw new Error(); }
    const response = await res.json();
    console.log(response);
   } catch (error) {
    console.log(error);
   }
}
