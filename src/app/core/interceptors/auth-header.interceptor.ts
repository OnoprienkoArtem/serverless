import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url === 'https://9dx96e6pzk.execute-api.eu-west-1.amazonaws.com/dev/import' && localStorage.getItem("authorization_token")) {
      const authRequest = request.clone({
        headers: request.headers.set("Authorization", `Basic ${localStorage.getItem("authorization_token")}`)
      });
      return next.handle(authRequest);
    }
    return next.handle(request);
  }
}



