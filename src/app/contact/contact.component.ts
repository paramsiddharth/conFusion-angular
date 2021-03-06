import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut } from '../animations/app.animation';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { FeedbackService } from '../services/feedback.service';
import { expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
	host: {
		'[@flyInOut]': 'true',
		'style': 'display: block'
	},
	animations: [
    flyInOut(),
    expand()
	]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackCopy?: Feedback = null;
  feedbackDone: boolean = true;
  feedbackErrMess: string = "";
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name required.',
      'minlength': 'First name must be at least 2 characters long.',
      'maxlength': 'First name cannot be more than 25 characters long.',
    },
    'lastname': {
      'required': 'Last name required.',
      'minlength': 'Last name must be at least 2 characters long.',
      'maxlength': 'Last name cannot be more than 25 characters long.',
    },
    'telnum': {
      'required': 'Telephone number required.',
      'pattern': 'Tel. num may only contain numbers.'
    },
    'email': {
      'required': 'E-mail address required.',
      'email': 'Invalid e-mail address.'
    }
  };

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (Re)Set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) return;
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // Clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && control.invalid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            //console.log(key);
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedbackDone = false;
    this.feedback = this.feedbackForm.value;
    this.feedbackFormDirective.resetForm();
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(fback => {
        this.feedbackCopy = fback;
        setTimeout(() => {
          this.feedbackCopy = null;
          this.feedbackDone = true;
        }, 5000);
        // console.log(fback);
      }, errmess => {
        this.feedbackErrMess = <any>errmess;
        setTimeout(() => {
          this.feedbackErrMess = '';
        }, 5000);
      });
  }

}
