import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MeetingRequestModel} from "../../models/landing/meeting.request.model";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(
    private httpClient: HttpClient
  ) {}

  public contactRequest(body: MeetingRequestModel): Observable<MeetingRequestModel> {
    return this.httpClient.post<MeetingRequestModel>(`api/Contact/ContactRequest`, body);
  }
}
