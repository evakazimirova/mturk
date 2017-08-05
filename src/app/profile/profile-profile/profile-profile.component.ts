import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../http.service';
import { CommonService } from '../../common.service';

@Component({
  selector: 'na-profile-profile',
  templateUrl: './profile-profile.component.html',
  styleUrls: ['./profile-profile.component.scss']
})
export class ProfileProfileComponent implements OnInit {
  form: FormGroup;
  loading = false;
  countrySelected = false;
  tutorials = this.common.user.tutorials;

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
      'english': ['NO', [
        Validators.required
      ]],
      'family': ['single', [
        Validators.required
      ]],
      'education': ['Higher education', [
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
      // подгружаем сохранённые данные
      this.http.get('AnnotatorProfile/getData').subscribe(
        profile => {
          profile.birthdate = profile.birthdate.slice(0, 10); // корректируем формат даты рождения
          this.form.patchValue(profile);
          this.common.user.englishTest = profile.englishTest;
        },
        error => console.error(error)
      );

      // подгружаем страны
      this.http.get('extra/countries').subscribe(
        countries => {
          $.typeahead({
            input: '#country',
            order: 'desc',
            hint: true,
            source: {
              data: countries
            },
            callback: {
              onHideLayout: (countryNode, country) => {
                this.form.patchValue({country: country});

                // подгружаем города страны
                if (country.length > 0) {
                  this.countrySelected = true;
                  this.http.get(`extra/cities?country=${country}`).subscribe(
                    cities => {
                      $.typeahead({
                        input: '#city',
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

      // подгружаем языки
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

      // подгружаем университеты
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

  // обновляем профиль аннотатора
  updateAnnotatorProfile(event) {
    event.preventDefault(); // отменяем стандартное действие

    if (this.form.valid) {
      if (this.form.value.personalDataAgreement) {
        if (!this.loading) {
          // отправляем запрос на сервер
          this.loading = true;
          this.http.post(this.form.value, '/annotatorProfile/update').subscribe(
            res => {
              this.loading = false;

              // обновляем прогресс-бар
              this.common.user.profile = 1;
            },
            error => {
              this.loading = false;
              console.error(error);
            }
          );
        }
      } else {
        this.common.alert('Надо согласиться на обработку персональных данных!');
      }
    } else {
      this.common.alert('Заполнены не все поля!');
    }
  }
}
