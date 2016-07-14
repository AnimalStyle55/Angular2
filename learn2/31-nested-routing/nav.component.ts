import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav.component.html',
  directives: ROUTER_DIRECTIVES
})
export class NavBar {
    // Navbars sometimes need access to the Router instance
    // router: Router;
    // this._router.navigate( ['Detail', { id: some.id }] );

    location: Location;

    constructor(location: Location) {
        // this.router = router; router: Router,
        this.location = location;
    }

    getLinkStyle(path: any) {
        return this.location.path() === path;
    }
}
