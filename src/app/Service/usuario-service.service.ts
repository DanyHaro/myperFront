import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

  private apiUrl = "https://localhost:44367";

  constructor(private http: HttpClient) {}

  RegisterTrabajador(datos:any):Observable<any>{
    const url = `${this.apiUrl}/create?TipoDocumento=${datos.tipoDocumento}
                              &NumeroDocumento=${datos.numeroDocumento}
                              &Nombres=${datos.nombres}
                              &Sexo=${datos.sexo}
                              &IdDepartamento=${datos.idDepartamento}
                              &IdProvincia=${datos.idProvincia}
                              &IdDistrito=${datos.idDistrito}`;
    return this.http.post(url, datos)
  }

  UpdateTrabajador(datos:any):Observable<any>{
    const url = `${this.apiUrl}/update?Id=${datos.id}
                              &TipoDocumento=${datos.tipoDocumento}
                              &NumeroDocumento=${datos.numeroDocumento}
                              &Nombres=${datos.nombres}
                              &Sexo=${datos.sexo}
                              &IdDepartamento=${datos.idDepartamento}
                              &IdProvincia=${datos.idProvincia}
                              &IdDistrito=${datos.idDistrito}`;
    return this.http.put(url, datos)
  }

  GetTrabajadores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Get`);
  }

  GetTrabajadoresV2(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAll`);
  }

  GetDepartamentos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetDepartamento`);
  }

  GetProvincias(idDepartamento: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetProvincias/?idDepartamento=${idDepartamento}`);
  }

  GetDistritos(idProvincia: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetDistritos/?idProvincia=${idProvincia}`);
  }

  DeleteUser(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/delete?id=${id}`);
  }

}
