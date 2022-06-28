import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick, flush } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { MainComponent } from './main/main.component';
import { FirstComponent } from '../components/first/first.component';
import { SolutionComponent } from '../components/solution/solution.component';
import { ManagementComponent } from '../components/management/management.component';
import { routes } from './pages-routing.module';

describe("Router: App", () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [MainComponent, FirstComponent, SolutionComponent, ManagementComponent]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    router.initialNavigation();
  });

  it("fakeAsync works", fakeAsync(() => {
    let promise = new Promise(resolve => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
  }));

  it('navigate to "" redirects you to first page', fakeAsync(() => {
    router.navigate([""]).then(() => {
      expect(location.path()).toBe("/");
    });
    flush();
  }));

  it('navigate to "solution" takes you to demo page', fakeAsync(() => {
    router.navigate(["/solution"]).then(() => {
      expect(location.path()).toBe("/solution");
    });
    flush();
  }));

  it('navigate to "main" takes you to editor page', fakeAsync(() => {
    router.navigate(["/main"]).then(() => {
      expect(location.path()).toBe("/main");
    });
    flush();
  }));

  it('navigate to "management" takes you to management page', fakeAsync(() => {
    router.navigate(["/management"]).then(() => {
      expect(location.path()).toBe("/management");
    });
    flush();
  }));

  it('navigate to "whatever" takes you to first page', fakeAsync(() => {
    router.navigate(["/whatever&^%#&$@213423"]).then(() => {
      expect(location.path()).toBe("/");
    });
    flush();
  }));

});