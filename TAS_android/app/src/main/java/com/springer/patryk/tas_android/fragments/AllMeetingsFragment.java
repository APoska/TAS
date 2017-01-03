package com.springer.patryk.tas_android.fragments;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.springer.patryk.tas_android.R;
import com.springer.patryk.tas_android.adapters.MeetingsListAdapter;
import com.springer.patryk.tas_android.adapters.TaskListAdapter;
import com.springer.patryk.tas_android.models.Meeting;
import com.springer.patryk.tas_android.models.Task;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import butterknife.BindView;
import co.moonmonkeylabs.realmrecyclerview.RealmRecyclerView;
import io.realm.Realm;
import io.realm.RealmResults;
import io.realm.Sort;

/**
 * Created by Patryk on 2017-01-02.
 */

public class AllMeetingsFragment extends BaseFragment {

    @BindView(R.id.listOfMeetings)
    RealmRecyclerView taskListView;
    @BindView(R.id.allMeetingsLabel)
    TextView currentDay;


    private Context mContext;
    private MeetingsListAdapter adapter;
    private RealmResults<Meeting>realmResults;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = getContext();
        String[] sortFieldNames = {"startDate", "startTime"};
        Sort[] sorts = {Sort.ASCENDING, Sort.ASCENDING};
        if (getArguments() == null) {
            realmResults=realm
                    .where(Meeting.class)
                    .findAllSorted(sortFieldNames,sorts);
        }else {
            String date = (String) getArguments().getSerializable("MeetingDate");
            realmResults=realm
                    .where(Meeting.class)
                    .equalTo("startDate",date)
                    .findAllSorted(sortFieldNames,sorts);
        }
        adapter = new MeetingsListAdapter(mContext, realmResults,userDetails.get("id"), true, true);
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        taskListView.setAdapter(adapter);
        currentDay.setText(R.string.meetings_list_label);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.meetings_list, null);

        return rootView;
    }

}