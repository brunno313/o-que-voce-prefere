import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly baseEndpoint = 'https://api.twitter.com/2/users/1266521717897379843/tweets?expansions=attachments.media_keys&media.fields=url,height,width&max_results=100';

  tweets$: Observable<any>;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.makeRequest();
  }

  getNextTweets(nextToken: string) {
    this.makeRequest(nextToken);
  }

  makeRequest(token?: string) {
    this.tweets$ = this.http.get<any>(
      this.baseEndpoint + (!!token ? `&pagination_token=${token}` : ''),
      {
        headers: {
          'authorization': `Bearer ${environment.twitter.bearerToken}`,
        }
      }
    ).pipe(map(res => {
      const count = ('https://t.co/sjMfgGRzOO').length;
      const allowedImages = res.data.filter(t => !!t.attachments && t.text.includes('https://t.co/') && t.text.length <= count).map(t => t.attachments.media_keys[0]);
      console.log(res.includes.media);
      return {
        meta: res.meta,
        media: res.includes.media.filter(m => allowedImages.includes(m.media_key) && m.width >= 900),
      }
    }));
  }

}
