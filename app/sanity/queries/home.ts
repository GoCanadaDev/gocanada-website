import groq from "groq";

export const HOME_QUERY = groq`*[_id == "home"][0]{ title, siteTitle }`
