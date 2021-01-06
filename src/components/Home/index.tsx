import React, {  useState } from 'react';
import { Field, Form, Formik, FormikConfig,FormikValues } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import { Card, CardContent,Button ,Box,Stepper,Step,StepLabel,Grid} from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import '../../App.css';


export interface FormType {
    firstname: string;
    lastname: string;
    age: number;
    email: string;
    number: number | null;
    city: string;
    country: string;
    cardname:string;
    cardNumber:number | null;
    date:Date |null;
}

const initialValues: FormType = {
    firstname: '',
    lastname: '',
    age: 0,
    email: '',
    number: null,
    city: '',
    country: '',
    cardname:'',
    cardNumber:null,
    date:null,
}

const validationSchema1 = Yup.object({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    age:Yup.number().max(60,'Age must be less than 60').min(10,'Age must be greater than 10').required('required'),
    email: Yup.string().email("Invalid Email").required("Required"),
});

const validationSchema2 = Yup.object({
    number:Yup.number().required('required'),
    city: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
});

const validationSchema3 = Yup.object({
    cardname:Yup.string().required('required'),
    cardNumber: Yup.number().required("Required"),
    date: Yup.date().required("Required"),
});

export default function Home() {

    return (
        <Card className="card">
            <CardContent >
                <FormikStepper initialValues={initialValues} onSubmit={(values,{setSubmitting})=>{
                    setTimeout(() => {
                        alert(JSON.stringify(values,null,2));
                        setSubmitting(false);
                    }, 1000);
                }} >
                        <FormikStep label="Add Personal Information" validationSchema={validationSchema1}>
                            <Box paddingBottom={2}>
                        <Field fullWidth name="firstname" component={TextField} label="First Name" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="lastname" component={TextField} label="Last Name" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="age" component={TextField} type="number" label="Age" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="email" component={TextField} label="Email Address" />
                        </Box>
                        </FormikStep>
                        <FormikStep label="Add Contact Information" validationSchema={validationSchema2}>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="number" component={TextField} label="Phone Number" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="city" component={TextField} label="City" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="country" component={TextField} label="Country" />
                        </Box>
                        </FormikStep>
                        <FormikStep label="Add Payment Method" validationSchema={validationSchema3} >
                        <Box paddingBottom={2}>
                        <Field fullWidth name="cardname" component={TextField} label="Card Name" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="cardNumber" component={TextField} label="Card Number" />
                        </Box>
                        <Box paddingBottom={2}>
                        <Field fullWidth name="date" InputLabelProps={{shrink: true,}} component={TextField} type="date" label="Expiration Date" />
                        </Box>
                        </FormikStep>
                </FormikStepper>
            </CardContent>
        </Card>
    )
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>,'children' | 'validationSchema' > {
    label:string;
    
}

export function FormikStep({children}:FormikStepProps){
    return <>{children}</>
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
    const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
    const [step, setStep] = useState(0);
    const currentChild = childrenArray[step];
    const [completed, setCompleted] = useState(false);
  
    function isLastStep() {
      return step === childrenArray.length - 1;
    }
  
    const QontoConnector = withStyles({
        alternativeLabel: {
          top: 10,
          left: 'calc(-50% + 16px)',
          right: 'calc(50% + 16px)',
        },
        active: {
          '& $line': {
            borderColor: '#784af4',
          },
        },
        completed: {
          '& $line': {
            borderColor: '#784af4',
          },
        },
        line: {
          borderColor: '#eaeaf0',
          borderTopWidth: 3,
          borderRadius: 1,
        },
      })(StepConnector);
    return (
      <Formik
        {...props}
        validationSchema={currentChild.props.validationSchema}
        onSubmit={async (values, helpers) => {
          if (isLastStep()) {
            await props.onSubmit(values, helpers);
            setCompleted(true);
          } else {
            setStep((s) => s + 1);
        }
    }}
    > 
        {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper connector={<QontoConnector />} alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}

          <Grid container spacing={2}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}