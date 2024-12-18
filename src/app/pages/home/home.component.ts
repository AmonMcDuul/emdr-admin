import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { EmdrScreenComponent } from "../../components/emdr-screen/emdr-screen.component";

@Component({
  selector: 'app-home',
  imports: [EmdrScreenComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(private signalRService: SignalRService){
      signalRService.connect()
    }

    startEmdr(){

    }
}
