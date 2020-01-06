import Cookies from "js-cookie";

export class UserService {
  username: any;
  constructor() {
    if (Cookies.get("ihaq_username") !== undefined) {
      this.username = Cookies.get("ihaq_username");
    } else {
      this.username = generateRandomUsername();
    }
  }
  getUsername() {
    return this.username;
  }
  saveUsernameLocally() {
    if (Cookies.get("ihaq_username") === undefined) {
      console.log("Cookie not set, creating one");
      Cookies.set("ihaq_username", this.username);
      window.localStorage.setItem("ihaq_username", this.username);
    }
  }
}

export const userService = new UserService();

function generateRandomUsername() {
  return "xxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
