import { HttpInterceptorFn } from '@angular/common/http';
import { SKIP_AUTH } from './skip-auth.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // if false it will insert the token into the request 
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');

  const authReq = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  return next(authReq);

};
