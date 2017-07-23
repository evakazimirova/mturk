import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-profile-profile',
  templateUrl: './profile-profile.component.html',
  styleUrls: ['./profile-profile.component.scss']
})
export class ProfileProfileComponent implements OnInit {
  @Output() profileModeSelected = new EventEmitter();
  form: FormGroup;
  loading = false;
  countrySelected = false;

  constructor(public common: CommonService,
              private http: HttpService,
              private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'name': ['', [
        Validators.required
      ]],
      'gender': ['', [
        Validators.required
      ]],
      'birthdate': ['', [
        Validators.required
      ]],
      'country': ['', [
        Validators.required
      ]],
      'city': ['', [
        Validators.required
      ]],
      'language': ['', [
        Validators.required
      ]],
      'english': ['', [
        Validators.required
      ]],
      'family': ['', [
        Validators.required
      ]],
      'education': ['', [
        Validators.required
      ]],
      'university': ['', [
        Validators.required
      ]],
      'speciality': ['', [
        Validators.required
      ]],
      'profession': ['', [
        Validators.required
      ]],
      'hobby': ['', [
        Validators.required
      ]],
      'personalDataAgreement': ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit() {
    $(document).ready(() => {
      const containerCountry = $('#country');
      const containerCity = $('#city');
      const containerLanguage = $('#language');
      const containerUniversity = $('#university');

      this.http.get('extra/countries').subscribe(
        countries => {
          containerCountry.typeahead({
            order: 'desc',
            hint: true,
            source: {
              data: countries
            },
            callback: {
              onHideLayout: (countryNode, country) => {
                this.form.patchValue({country: country});

                if (country.length > 0) {
                  this.countrySelected = true;
                  this.http.get(`extra/cities?country=${country}`).subscribe(
                    cities => {
                      containerCountry.typeahead({
                        order: 'desc',
                        hint: true,
                        source: {
                          data: cities
                        },
                        callback: {
                          onHideLayout: (cityNode, city) => {
                            this.form.patchValue({city: city});
                          }
                        }
                      });
                    },
                    error => {
                      this.countrySelected = false;
                      console.error(error);
                    }
                  );
                } else {
                  this.countrySelected = false;
                }
              }
            }
          });
        },
        error => console.error(error)
      );

      this.http.get('extra/languages').subscribe(
        languages => {
          $.typeahead({
            input: '#language',
            order: 'desc',
            hint: true,
            source: {
              data: languages
            },
            callback: {
              onHideLayout: (languageNode, language) => {
                this.form.patchValue({language: language});
              }
            }
          });
        },
        error => console.error(error)
      );

      this.http.get('extra/universities').subscribe(
        universities => {
          $.typeahead({
            input: '#university',
            order: 'desc',
            hint: true,
            source: {
              data: universities
            },
            callback: {
              onHideLayout: (languageNode, university) => {
                this.form.patchValue({university: university});
              }
            }
          });
        },
        error => console.error(error)
      );
    });
  }

  selectProfileMode(page) {
    this.profileModeSelected.emit(page);
  }

  updateAnnotatorProfile(event) {
    event.preventDefault(); // отменяем стандартное действие

    // 'name': ['', [
    //     Validators.required
    //   ]],
    //   'gender': ['', [
    //     Validators.required
    //   ]],
    //   'birthdate': ['', [
    //     Validators.required
    //   ]],
    //   'country': ['', [
    //     Validators.required
    //   ]],
    //   'city': ['', [
    //     Validators.required
    //   ]],
    //   'language': ['', [
    //     Validators.required
    //   ]],
    //   'english': ['', [
    //     Validators.required
    //   ]],
    //   'family': ['', [
    //     Validators.required
    //   ]],
    //   'education': ['', [
    //     Validators.required
    //   ]],
    //   'university': ['', [
    //     Validators.required
    //   ]],
    //   'specialty': ['', [
    //     Validators.required
    //   ]],
    //   'profession': ['', [
    //     Validators.required
    //   ]],
    //   'hobby': ['', [
    //     Validators.required
    //   ]],
    //   'personalDataAgreement': ['', [
    //     Validators.required
    //   ]]

    console.log(this.form.value);

    // // собираем информацию с полей
    // const userData = {
    //   firstName: this.form.value.firstName,
    //   secondName: this.form.value.secondName,
    //   login: this.form.value.login,
    //   email: this.form.value.email.toLowerCase(),
    //   password: this.form.value.password
    // };

    // // отправляем запрос на сервер
    // this.loading = true;
    // this.http.post(userData, '/annotators/register').subscribe(
    //   user => {
    //     this.loading = false;

    //     // выводим сообщение об успехе
    //     console.log(`We have sent an e-mail to the "${user.email}". Please check it out!`);
    //   },
    //   error => {
    //     this.loading = false;

    //     // обработка ошибок
    //     const status = error._body;
    //     switch (status) {
    //       case 'user exists':
    //         // если такой пользователь уже есть, то предлагается восстановить пароль
    //         console.error('Annotator with this email is already exists in the system.');
    //         break;

    //       default:
    //         console.error(status);
    //         break;
    //     }
    //   }
    // );
  }
}
