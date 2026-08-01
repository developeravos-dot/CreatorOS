import { Injectable } from "@nestjs/common";

@Injectable()
export class SponsorCRMService {

  private readonly sponsors = [

    {
      id:"sp-001",
      name:"Tech Vision",
      status:"qualified",
      country:"UAE"
    },

    {
      id:"sp-002",
      name:"Kids Planet",
      status:"contacted",
      country:"Saudi Arabia"
    }

  ];

  getSponsors(){
    return this.sponsors;
  }

}
