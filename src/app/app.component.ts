import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioServiceService } from "../app/Service/usuario-service.service";
import { Trabajador } from './Models/Trabajador';
import { TrabajadorDto } from './Models/TrabajadorDto';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  pageTitle = 'Listado de trabajadores';
  trabajadores:Trabajador[] = [];
  trabajadoresDto:TrabajadorDto[]=[];
  departamentos:any[] = [];
  provincias:any[] = [];
  distritos:any[] = [];
  formulario: FormGroup;
  formularioUpdate: FormGroup;
  trabajadorDeleteId:number;
  trabajadorUpdate: Trabajador;

  constructor(private apiService : UsuarioServiceService, private fb: FormBuilder){

  }

  ngOnInit(){
    
    this.formulario = this.fb.group({
      ndocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      tipodocumento: ['', Validators.required],
      sexo: ['', Validators.required],
      departamento: ['',Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required]
    })

    this.formularioUpdate = this.fb.group({
      ndocumento: [this.trabajadorUpdate?.numeroDocumento || '', Validators.required],
      nombre: [this.trabajadorUpdate?.nombres || '', Validators.required],
      tipodocumento: ['', Validators.required],
      sexo: ['', Validators.required],
      departamento: [''],
      provincia: [''],
      distrito: ['']
    })

    // this.apiService.GetTrabajadores().subscribe(data => {
    //   this.trabajadores = data
    //   console.log(this.trabajadores)
    // }, error => {
    //   console.log("Error al obtener todos los trabajadores", error)
    // })

    this.apiService.GetTrabajadoresV2().subscribe(data => {
      this.trabajadoresDto = data
      console.log(this.trabajadoresDto)
    })

  }

  onDepartamentoChange(event: any){
    const selectedDepartamentoId = event.target.value;

    this.apiService.GetProvincias(selectedDepartamentoId).subscribe(data=>{
      this.provincias = data
    })
  }

  onProvinciaChange(event: any){
    const selectedProvinciaId = event.target.value;

    this.apiService.GetDistritos(selectedProvinciaId).subscribe(data=>{
      this.distritos = data
    })
  }

  guardar(){

    if (this.formulario.valid) {
      const datos = this.formulario.value;
      datos.sexo = datos.sexo ? datos.sexo.charAt(0).toUpperCase() : '';

      const trabajador: Trabajador = {
        //id:0,
        tipoDocumento:datos.tipodocumento,
        numeroDocumento:datos.ndocumento,
        nombres:datos.nombre,
        sexo:datos.sexo,
        idDepartamento:datos.departamento,
        idProvincia:datos.provincia,
        idDistrito:datos.distrito
      }

      this.apiService.RegisterTrabajador(trabajador).subscribe(response => {

        this.apiService.GetTrabajadoresV2().subscribe(data => {
          this.trabajadoresDto = data
          this.closeModal()
        })
        
      }, error=>{
        console.log("Error al guardar", error)
      })
    }else{
      console.log("rellene todos los datos")
    }
  }

  Actualizar(){

    if (this.formularioUpdate.valid) {
      const datos = this.formularioUpdate.value;
      datos.sexo = datos.sexo ? datos.sexo.charAt(0).toUpperCase() : '';

      const trabajador: Trabajador = {
        id:this.trabajadorUpdate.id,
        tipoDocumento:datos.tipodocumento,
        numeroDocumento:datos.ndocumento,
        nombres:datos.nombre,
        sexo:datos.sexo,
        idDepartamento:datos.departamento,
        idProvincia:datos.provincia,
        idDistrito:datos.distrito
      }

      this.apiService.UpdateTrabajador(trabajador).subscribe(response=>{
        
        this.apiService.GetTrabajadoresV2().subscribe(data => {
          this.trabajadoresDto = data
          this.closeModalUpdate()
        })
      }) 
    }else{
      console.log("Rellene todos los campos")
    }
  }

  eliminarRegistro(){
    this.apiService.DeleteUser(this.trabajadorDeleteId).subscribe(data=>{
      this.closeDeleteModal();
      this.apiService.GetTrabajadoresV2().subscribe(data => {
        this.trabajadoresDto = data
      })
    })
  }

  openModal() {
    this.apiService.GetDepartamentos().subscribe(data => {
      this.departamentos = data
      console.log(this.departamentos)
    })

    $('#modalRegister').modal('show');
  }

  closeModal() {
    $('#modalRegister').modal('hide');
    this.formulario.reset({
      departamento:'',
      provincia:'',
      distrito:''
    });
    this.provincias=[];
    this.distritos=[];
    console.log("formulario limpio")
  }

  openDeleteModal(id:number){
    this.trabajadorDeleteId = id
    $('#confirmacionModal').modal('show');
  }

  closeDeleteModal(){
    $('#confirmacionModal').modal('hide')
  }

  openModalUpdate(trabajador:any){
    this.trabajadorUpdate = trabajador;
    this.ngOnInit()

    this.apiService.GetDepartamentos().subscribe(data => {
      this.departamentos = data
      console.log(this.departamentos)
    })

    $('#modalUpdate').modal('show');
  }

  closeModalUpdate(){
    $('#modalUpdate').modal('hide');
  }
}
