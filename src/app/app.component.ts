import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly baseEndpoint = 'https://api.twitter.com/2/users/1266521717897379843/tweets?expansions=attachments.media_keys&media.fields=url,height,width&max_results=100';

  nextTokenCache: string;

  loading = false;

  question$: Observable<any>;

  constructor(
    private http: HttpClient
  ) { }

  getQuestion() {
    this.loading = true;

    setTimeout(() => {
      this.question$ = this.http.get<any>(
        this.baseEndpoint + (!!this.nextTokenCache ? `&pagination_token=${this.nextTokenCache}` : ''),
        {
          headers: {
            'authorization': `Bearer ${environment.twitter.bearerToken}`,
          }
        }
      )
      .pipe(
        map(res => {
          const count = ('https://t.co/sjMfgGRzOO').length;
          const allowedImages = res.data.filter(t => !!t.attachments && t.text.includes('https://t.co/') && t.text.length <= count).map(t => t.attachments.media_keys[0]);
          const questions = res.includes.media.filter(m => allowedImages.includes(m.media_key) && m.width >= 900);

          if (!!res.meta.next_token) {
            this.nextTokenCache = res.meta.next_token;
          }

          return questions[Math.floor(Math.random() * questions.length)];
        }),
        tap(() => this.loading = false)
      );
    }, Math.floor(Math.random() * (4000) + 1000));
  }

}
