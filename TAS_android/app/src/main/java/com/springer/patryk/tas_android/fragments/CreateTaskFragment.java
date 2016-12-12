package com.springer.patryk.tas_android.fragments;

import android.os.Bundle;
import android.support.annotation.Nullable;

import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TimePicker;
import android.widget.Toast;

import com.springer.patryk.tas_android.MyApp;
import com.springer.patryk.tas_android.R;
import com.springer.patryk.tas_android.SessionManager;
import com.springer.patryk.tas_android.models.Task;

import butterknife.BindView;
import butterknife.ButterKnife;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by Patryk on 10.12.2016.
 */

public class CreateTaskFragment extends Fragment {

    @BindView(R.id.newTaskTitle)
    EditText taskTitle;
    @BindView(R.id.newTaskDescription)
    EditText taskDescription;
    @BindView(R.id.newTaskStartDate)
    DatePicker taskStartDate;
    @BindView(R.id.newTaskStartTime)
    TimePicker taskStartTime;
    @BindView(R.id.newTaskEndDate)
    DatePicker taskEndDate;
    @BindView(R.id.newTaskEndTime)
    TimePicker taskEndTime;
    @BindView(R.id.createNewTask)
    Button createTask;
    SessionManager sessionManager;

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.new_task_dialog, null);
        ButterKnife.bind(this, rootView);

        sessionManager = new SessionManager(getContext());
        createTask.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                createTask();
            }
        });

        return rootView;
    }

    public void createTask() {
        Task task = new Task();
        task.setTitle(taskTitle.getText().toString());
        task.setUser(sessionManager.getUserDetails().get("id"));
        task.setDescription(taskDescription.getText().toString());
        String startDate=taskStartDate.getYear()+"-"+taskStartDate.getMonth()+"-"+taskStartDate.getDayOfMonth()+"T";
        String startTime=taskStartTime.getCurrentHour()+":"+taskStartTime.getCurrentMinute()+":00.000Z";
        task.setStartDate(startDate+startTime);
        String endDate=taskEndDate.getYear()+"-"+taskEndDate.getMonth()+"-"+taskEndDate.getDayOfMonth()+"T";
        String endTime=taskEndTime.getCurrentHour()+":"+taskEndTime.getCurrentMinute()+":00.000Z";
        task.setEndDate(endDate+endTime);
        Call<Task>call= MyApp.getApiService().createTask(task);
        call.enqueue(new Callback<Task>() {
            @Override
            public void onResponse(Call<Task> call, Response<Task> response) {
                Toast.makeText(getContext(),response.toString(),Toast.LENGTH_LONG).show();
            }

            @Override
            public void onFailure(Call<Task> call, Throwable t) {

            }
        });
    }

}
