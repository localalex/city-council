import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Meeting} from '../../models/meeting';
import {Item} from '../../models/item';
import {MeetingService} from '../../services/meeting.service';
import {ItemService} from '../../services/item.service';
import {AppFocusService} from '../../services/app-focus.service';

@Component({
  selector: 'civ-meeting-container',
  template: `
    <civ-meeting-view [meeting]="meeting$ | async" [items]="items$ | async" (showItem)="showItem($event)">

    </civ-meeting-view>
  `,
  styles: [ `:host { display: block }` ],
  host: { '[@host]': '' },
  animations: [
    trigger('host', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('250ms 100ms ease-in', style({ opacity: 1 }))
      ])/*,
       transition('* => void', [
       animate('250ms 100ms ease-in', style({transform:'translateX(-100%)'}))
       ])*/
    ])
  ]
})
export class MeetingContainerComponent implements OnInit {

  meeting$: Observable<Meeting>;
  items$: Observable<Item[]>;


  constructor(private meetingSvc: MeetingService, private itemSvc: ItemService, private router: Router, private route: ActivatedRoute, private focusSvc: AppFocusService) {
    const id$ = this.route.params.map(params => params['meetingId']).distinctUntilChanged();

    this.route.params.subscribe(params => {
      this.focusSvc.selectItem(params['itemId']);
      this.focusSvc.selectGroup(params['groupId']);
      this.focusSvc.selectMeeting(params['meetingId']);
    });


    this.meeting$ = this.meetingSvc.getSelectedMeeting().filter(it => !!it);

    this.items$ = this.meetingSvc.getAgendaItemsOfSelectedMeeting().map(arr => arr.filter(it => !!it));

    /*
    this.items$ = this.meeting$
      .filter(it => !!it)
     .map(mtg => mtg.items);*/

  }

  showItem(id: string) {
    this.router.navigate([ 'item', id ], { relativeTo: this.route });
  }

  ngOnInit() {
  }

}