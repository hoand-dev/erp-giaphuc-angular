import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* chỉ là import thôi mà nó quan trọng lắm nha ahihi ^_^ */
import { AuthGuard } from '@app/_helpers';
import { LichSuComponent } from './pages';

const routes: Routes = [
    {
        path: 'he-thong',
        canActivate: [AuthGuard],
        children: [
            { path: 'lich-su', component: LichSuComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeThongRoutingModule {}
