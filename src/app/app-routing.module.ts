import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { NotPermissionComponent } from './shared/components/not-permission/not-permission.component';

const routes: Routes = [
    { path: 'trang-chu', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'khong-co-quyen', component: NotPermissionComponent },
    { path: '', redirectTo: '/trang-chu', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent } // không tìm thấy trang
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
