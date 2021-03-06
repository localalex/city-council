import { Component } from '@angular/core';
import { MeetingService } from '../meeting.service';
import { GroupService } from '../../group/group.service';
import { Observable } from 'rxjs/Observable';
import { Meeting, PartialMeeting } from '../meeting.model';
import { Item } from '../../item/item.model';
import { ItemService } from '../../item/item.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'civ-meeting-admin',
    template: `
        <civ-meeting-admin-view [meeting]="meeting$ | async" [items]="items$ | async"
                                (setFeedbackStatus)="setFeedbackStatus($event)"
                                (setPublished)="setPublished($event)"
                                (updateInfo)="updateInfo($event)"
                                (gotoItem)="gotoItem($event)"
                                *ngIf="!!(meeting$ | async) && !!(items$ | async); else loading "
        ></civ-meeting-admin-view>
        <ng-template #loading>
          <civ-loading class="loading"></civ-loading>
        </ng-template>

    `,
  styleUrls: [ '../../shared/pages.scss' ],
})
export class MeetingAdminPage {

    meeting$: Observable<Meeting>;
    items$: Observable<Item[]>;

  constructor(private meetingSvc: MeetingService, private groupSvc: GroupService, private itemSvc: ItemService, private router: Router, private route: ActivatedRoute) {
        this.meeting$ = meetingSvc.getSelectedMeeting();
        this.items$ = this.meetingSvc.getAgendaItemsOfSelectedMeeting().map(arr => arr.filter(it => !!it));

    }

    setFeedbackStatus(it: { meetingId: string, itemId: string, value: boolean }) {
        this.itemSvc.updateFeedbackStatus(it.itemId, it.meetingId, it.value);
    }

    setPublished(it: { meetingId: string, value: boolean }) {
        this.meetingSvc.setPublished(it.meetingId, it.value);
    }

  updateInfo(it: { meetingId: string, updates: PartialMeeting }) {
    this.meetingSvc.update(it.meetingId, it.updates);
  }

  gotoItem(id: string) {
    this.router.navigate([ '../', 'item', id ], { relativeTo: this.route });
  }
}
