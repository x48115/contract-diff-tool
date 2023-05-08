const baseUrl = "http://localhost:80";

export default {
  get: async (route) => {
    const url = `${baseUrl}${route}`;
    console.log("get", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    return result;
  },
};
