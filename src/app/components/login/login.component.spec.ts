import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {UserResponse, UserService} from '../../services/user.service';
import { Logica } from '../../logica/logica';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockLogica: jasmine.SpyObj<Logica>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UserService', ['login', 'setUser']);
    mockLogica = jasmine.createSpyObj('Logica', ['showSnackBar']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: Logica, useValue: mockLogica }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to /hotels on success', () => {
    const fakeUser: UserResponse = {
      id: 1,
      name: 'Jandro',
      email: 'test@dom.com',
      password: 'pass123',
      createdAt: '2024-01-01T00:00:00.000Z',
      img: 'profile.jpg',
      saldo: '100.00',
      isAdmin: false
    };

    component.user = { email: 'test@example.com', password: '1234' };

    mockUserService.login.and.returnValue(of(fakeUser));
    component.login();

    expect(mockUserService.login).toHaveBeenCalledWith(component.user);
    expect(mockUserService.setUser).toHaveBeenCalledWith(fakeUser);
    expect(mockLogica.showSnackBar).toHaveBeenCalledWith('Inicio de sesión exitoso', 'success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/hotels']);
  });

  it('should show error message and call showSnackBar on login failure', () => {
    const fakeError = { error: { message: 'Credenciales inválidas' } };
    component.user = { email: 'wrong@example.com', password: 'badpass' };

    mockUserService.login.and.returnValue(throwError(() => fakeError));

    component.login();

    expect(mockUserService.login).toHaveBeenCalledWith(component.user);
    expect(component.message).toBe('Credenciales inválidas');
    expect(mockLogica.showSnackBar).toHaveBeenCalledWith('Credenciales inválidas', 'error');
  });

  it('should navigate to /register on goToRegister()', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });
});
